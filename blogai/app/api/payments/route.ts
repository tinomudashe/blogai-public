// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from '@/lib/payment-helpers';
import getDbConnection from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        console.log({ session });
        const sql = await getDbConnection();
        await handleCheckoutSessionCompleted({ session, stripe, sql });
        break;
      }
      case "customer.subscription.deleted": {
        const subscriptionId = event.data.object.id;
        const sql = await getDbConnection();
        await handleSubscriptionDeleted({ subscriptionId, stripe, sql });
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ status: "Failed", error: err.message }, { status: 400 });
  }
}