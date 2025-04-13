import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payment-helpers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);



export async function POST(req:NextRequest){

    const payload = await req.text();
    const sig = req.headers.get
    ('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent
        (payload,
             sig!,
             process.env.STRIPE_WEBHOOK_KEY!);
    

    switch (event.type){
        
        case "checkout.session.completed":{

            const session = await stripe.checkout.sessions.retrieve(
                event.data.object.id,
                {
                    expand: ["line_items"],
                }
            );
            console.log({session});

            await handleCheckoutSessionCompleted({session,stripe})

            //connect to db create or update user
            break;
        }
        case "customer.subscription.deleted":{

            const subscriptionId = event.data.object.id;
            const subscription = await stripe.
            subscriptionItems.retrieve(subscriptionId);
            console.log({subscription});

            await handleSubscriptionDeleted({ subscriptionId, stripe})

            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
} 
    catch (err){
        return NextResponse.json({status:"Failed",err})
    }
    return NextResponse.json({
        status:"success",
    });
}