import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("subscription_status, trial_ends_at, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Erro ao carregar perfil" }, { status: 500 });
  }

  // stripe_customer_id is resolved server-side; only the boolean reaches the client.
  // no-store prevents stale data after a Stripe webhook updates subscription_status.
  return NextResponse.json(
    {
      subscriptionStatus: data.subscription_status as string | null,
      trialEndsAt: data.trial_ends_at as string | null,
      hasStripe: data.stripe_customer_id !== null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
