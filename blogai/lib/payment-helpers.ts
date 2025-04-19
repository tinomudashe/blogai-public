// lib/payment-helpers.ts
import Stripe from "stripe";

async function insertPayment(
  sql: any,
  session: Stripe.Checkout.Session,
  priceId: string,
  customerEmail: string
) {
  try {
    await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email) VALUES (${session.amount_total}, ${session.status}, ${session.id}, ${priceId}, ${customerEmail})`;
  } catch (err) {
    console.error("Error in inserting payment", err);
    throw err;
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
      console.log("Inserting new user with:", {
        email: customer.email,
        fullName: customer.name,
        customerId: customerId,
      });
      await sql`INSERT INTO users (email, full_name, customer_id) VALUES (${customer.email}, ${customer.name}, ${customerId})`;
      console.log("New user inserted successfully");
    } else {
      console.log("User with email", customer.email, "already exists.");
    }
  } catch (err) {
    console.error("Error in inserting/updating user", err);
    throw err;
  }
}

async function updateUserSubscription(
  sql: any,
  priceId: string,
  email: string
) {
  try {
    await sql`UPDATE users SET price_id = ${priceId}, status = 'active' where email = ${email}`;
  } catch (err) {
    console.error("Error in updating user", err);
    throw err;
  }
}

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
  sql,
}: {
  subscriptionId: string;
  stripe: Stripe;
  sql: any;
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await sql`UPDATE users SET status = 'cancelled' WHERE customer_id = ${subscription.customer}`;
    console.log(`Subscription ${subscriptionId} cancelled for customer ${subscription.customer}`);
  } catch (error) {
    console.error("Error handling subscription deletion", error);
    throw error;
  }
}

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
  sql,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
  sql: any;
}) {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id;

  console.log("Stripe session object", session);
  console.log("Stripe customer", customer);

  if ("email" in customer && priceId && sql) {
    try {
      await createOrUpdateUser(sql, customer, customerId);
      await updateUserSubscription(sql, priceId, customer.email as string);
      await insertPayment(sql, session, priceId, customer.email as string);
      console.log("Checkout session completed successfully for customer:", customer.email);
    } catch (error) {
      console.error("Error during checkout session completion", error);
      throw error;
    }
  } else {
    console.warn("Missing customer email, price ID, or database connection during checkout completion.");
  }
}