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
    await sql`UPDATE users SET status = 'cancelled' WHERE customer_id = ${subscription.customer}`;
  } catch (error) {
    console.error("Error handling subscription deletion for subscriptionId:", subscriptionId, error);
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
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id;

  const sql = await getDbConnection();
  console.log("Stripe session object", session);
  console.log("Stripe customer", customer);

  if ("email" in customer && priceId) {
    await createOrUpdateUser(sql, customer, customerId);
    await updateUserSubscription(sql, priceId, customer.email as string);
    await insertPayment(sql, session, priceId, customer.email as string);
    console.log("Customer and payment data processed successfully.");
  } else {
    console.error("Missing email or priceId in session or customer data.");
  }
}

async function insertPayment(
  sql: any,
  session: Stripe.Checkout.Session,
  priceId: string,
  customerEmail: string
) {
  try {
    await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email) VALUES (${session.amount_total}, ${session.status}, ${session.id}, ${priceId}, ${customerEmail})`;
  } catch (err) {
    console.error("Error inserting payment for session:", session.id, err);
  }
}

async function createOrUpdateUser(
  sql: any,
  customer: Stripe.Customer,
  customerId: string
) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${customer.email}`;
    if (user.length === 0) {
      await sql`INSERT INTO users (email, full_name, customer_id) VALUES (${customer.email}, ${customer.name}, ${customerId})`;
    }
  } catch (err) {
    console.error("Error creating or updating user for customerId:", customerId, err);
  }
}

async function updateUserSubscription(
  sql: any,
  priceId: string,
  email: string
) {
  try {
    await sql`UPDATE users SET price_id = ${priceId}, status = 'active' WHERE email = ${email}`;
  } catch (err) {
    console.error("Error updating subscription for email:", email, err);
  }
}