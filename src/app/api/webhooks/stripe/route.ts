import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        // Update user status in Supabase
        const { error } = await supabase
          .from("profiles")
          .update({ is_premium: true, stripe_customer_id: session.customer as string })
          .eq("id", userId);

        if (error) {
          console.error("Erro ao atualizar status premium:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
      }
      break;
    
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Update user status to not premium
      const { error: deleteError } = await supabase
        .from("profiles")
        .update({ is_premium: false })
        .eq("stripe_customer_id", customerId);

      if (deleteError) {
        console.error("Erro ao remover status premium:", deleteError);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
