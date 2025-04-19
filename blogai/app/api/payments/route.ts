import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payment-helpers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,);

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_KEY!
        );

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const retrievedSession = await stripe.checkout.sessions.retrieve(
                    session.id,
                    {
                        expand: ["line_items"],
                    }
                );
                console.log({ retrievedSession });

                await handleCheckoutSessionCompleted({
                    session: retrievedSession,
                    stripe,
                });

                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                console.log({ subscription });

                await handleSubscriptionDeleted({
                    subscriptionId: subscription.id,
                    stripe,
                });

                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (err: unknown) {
        console.error("Error processing Stripe webhook:", err);
        return NextResponse.json({ status: "Failed", error: (err as Error).message });
    }

    return NextResponse.json({
        status: "success",
    });
}