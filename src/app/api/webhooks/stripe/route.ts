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

  async function logSubscriptionAudit(
    actorId: string | null,
    eventType: string,
    entityId: string | null,
    metadata: Record<string, unknown>
  ) {
    if (!actorId) return;

    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      event_type: eventType,
      entity_type: "subscription",
      entity_id: entityId,
      metadata,
    });
  }

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
        await logSubscriptionAudit(userId, "subscription.checkout_completed", customerId, {
          stripeCustomerId: customerId,
        });
      } else if (email) {
        const { data: updatedUser } = await supabase
          .from("users")
          .update({
            subscription_status: "active",
            stripe_customer_id: customerId,
          })
          .eq("email", email)
          .select("id");
        const actorId = Array.isArray(updatedUser) ? updatedUser[0]?.id : null;
        await logSubscriptionAudit(actorId, "subscription.checkout_completed", customerId, {
          stripeCustomerId: customerId,
          matchedBy: "email",
        });
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

      const { data: users } = await supabase
        .from("users")
        .update({ subscription_status: mappedStatus })
        .select("id")
        .eq("stripe_customer_id", customerId);
      const actorId = Array.isArray(users) ? users[0]?.id : null;
      await logSubscriptionAudit(actorId, "subscription.updated", customerId, {
        stripeStatus: status,
        mappedStatus,
      });
      break;
    }

    // Subscription fully deleted
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      const { data: users } = await supabase
        .from("users")
        .update({ subscription_status: "cancelled" })
        .select("id")
        .eq("stripe_customer_id", customerId);
      const actorId = Array.isArray(users) ? users[0]?.id : null;
      await logSubscriptionAudit(actorId, "subscription.deleted", customerId, {
        mappedStatus: "cancelled",
      });
      break;
    }

    // Payment failed on invoice
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const { data: users } = await supabase
        .from("users")
        .update({ subscription_status: "expired" })
        .select("id")
        .eq("stripe_customer_id", customerId);
      const actorId = Array.isArray(users) ? users[0]?.id : null;
      await logSubscriptionAudit(actorId, "subscription.payment_failed", customerId, {
        mappedStatus: "expired",
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
