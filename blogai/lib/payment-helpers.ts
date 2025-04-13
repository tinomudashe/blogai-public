import Stripe from "stripe";
import getDbConnection from "./db";

export async function handleSubscriptionDeleted({subscriptionId, stripe}:{
    subscriptionId: string,stripe: Stripe
}){
    try{
       
        const subscription = await stripe.
            subscriptions.retrieve(subscriptionId);
        const sql = await getDbConnection();
        await sql`UPDATE users SET status = 'cancelled' WHERE customer_id = ${subscription.customer}`;
    
    }catch(err){
        console.error("Error handling subscription deletion",err);
        throw err;
} 
}

export async function handleCheckoutSessionCompleted({
    stripe,
    session
}:{
    session:Stripe.Checkout.Session;
    stripe: Stripe;

}
){
    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const sql = await getDbConnection();
    const priceId = session.line_items?.data[0].price?.id;

    if("email" in customer && priceId){
        await createOrUpdateUser(sql,customer,customerId);
       
        await updateUserSubscription(sql,priceId, customer.email as string);

        await insertPayment(sql, session,priceId, customer.email as string);
    }
    
}

async function insertPayment(sql:any, session:Stripe.Checkout.Session,priceId:string,customerEmail:string ){
    try{
       
            await sql`INSERT INTO payments(amount,status,stripe_payment_id,price_id,user_email) VALUES (
                ${session.amount_total},${session.status},${session.id},${priceId},${customerEmail})`;
        }
        
    catch(err){
        console.error("Error in inserting payement",err)
    }
}

async function createOrUpdateUser( sql:any, customer:Stripe.Customer,
    customerId: string){
    try{
        const user = await sql`SELECT * FROM users WHERE email = ${customer.email}`;
        if(user.length===0){
            await sql`INSERT INTO users(email,full_name,customer_id) VALUES (
                ${customer.email},${customer.name},${customerId})`;
        }
        
    } catch(err){
        console.error("Error in inserting user",err)
    }
}

async function updateUserSubscription(
    sql:any,
    priceId:string,
    email:string

){
    try{
        await sql`UPDATE users SET price_id = ${priceId}, status = 'active' where email = ${email}`;
        
    } catch(err){
        console.error("Error in updating user",err)
    }
}