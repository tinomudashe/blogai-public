import Stripe from "stripe";
import getDbConnection from "./db";

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sql = await getDbConnection();

    const result = await sql`
      UPDATE users 
      SET status = 'cancelled' 
      WHERE customer_id = ${subscription.customer}
      RETURNING *;
    `;

    console.log("Subscription cancelled for user:", result);
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
    throw error;
  }
}

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  try {
    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const sql = await getDbConnection();

    // Fetch line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 1,
    });

    const priceId = lineItems.data[0]?.price?.id;

    console.log("Stripe session:", session);
    console.log("Stripe customer:", customer);
    console.log("Line items:", lineItems);

    if (!priceId) {
      console.error("Missing priceId in line items");
      return;
    }

    if ("email" in customer && customer.email) {
      await createOrUpdateUser(sql, customer, customerId);
      await updateUserSubscription(sql, priceId, customer.email);
      await insertPayment(sql, session, priceId, customer.email);
      console.log("Customer created or updated successfully");
    } else {
      console.error("Customer email not found.");
    }
  } catch (error) {
    console.error("Error handling checkout session completion:", error);
    throw error;
  }
}

async function insertPayment(
  sql: any,
  session: Stripe.Checkout.Session,
  priceId: string,
  customerEmail: string
) {
  try {
    const result = await sql`
      INSERT INTO payments (
        amount, status, stripe_payment_id, price_id, user_email
      ) VALUES (
        ${session.amount_total},
        ${session.status},
        ${session.id},
        ${priceId},
        ${customerEmail}
      )
      RETURNING *;
    `;
    console.log("Payment inserted:", result);
  } catch (err) {
    console.error("Error inserting payment:", err);
  }
}

async function createOrUpdateUser(
  sql: any,
  customer: Stripe.Customer,
  customerId: string
) {
  try {
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${customer.email};
    `;

    if (existingUser.length === 0) {
      const inserted = await sql`
        INSERT INTO users (email, full_name, customer_id) 
        VALUES (${customer.email}, ${customer.name}, ${customerId})
        RETURNING *;
      `;
      console.log("New user inserted:", inserted);
    } else {
      console.log("User already exists:", existingUser[0]);
    }
  } catch (err) {
    console.error("Error inserting or checking user:", err);
  }
}

async function updateUserSubscription(
  sql: any,
  priceId: string,
  email: string
) {
  try {
    const result = await sql`
      UPDATE users 
      SET price_id = ${priceId}, status = 'active' 
      WHERE email = ${email}
      RETURNING *;
    `;
    console.log("User subscription updated:", result);
  } catch (err) {
    console.error("Error updating user subscription:", err);
  }
}