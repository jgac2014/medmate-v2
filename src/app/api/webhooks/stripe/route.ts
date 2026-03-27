import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  switch (event.type) {
    // User completed checkout → activate subscription
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId = session.customer as string;
      const email = session.customer_email;
      const userId = session.metadata?.supabase_user_id;

      // Prefer matching by user ID (set in metadata), fall back to email
      if (userId) {
        await supabase
          .from("users")
          .update({
            subscription_status: "active",
            stripe_customer_id: customerId,
          })
          .eq("id", userId);
      } else if (email) {
        await supabase
          .from("users")
          .update({
            subscription_status: "active",
            stripe_customer_id: customerId,
          })
          .eq("email", email);
      }
      break;
    }

    // Subscription updated (e.g., renewal, plan change, cancel scheduled)
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const status = subscription.status; // active, past_due, canceled, unpaid, trialing

      let mappedStatus: string;
      switch (status) {
        case "active":
          mappedStatus = "active";
          break;
        case "trialing":
          mappedStatus = "trial";
          break;
        case "past_due":
        case "unpaid":
          mappedStatus = "expired";
          break;
        case "canceled":
          mappedStatus = "cancelled";
          break;
        default:
          mappedStatus = "expired";
      }

      await supabase
        .from("users")
        .update({ subscription_status: mappedStatus })
        .eq("stripe_customer_id", customerId);
      break;
    }

    // Subscription fully deleted
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await supabase
        .from("users")
        .update({ subscription_status: "cancelled" })
        .eq("stripe_customer_id", customerId);
      break;
    }

    // Payment failed on invoice
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      await supabase
        .from("users")
        .update({ subscription_status: "expired" })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
