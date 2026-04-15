import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = createAdminSupabaseClient();

  // List patients
  const { data: patients, error: pErr } = await admin
    .from("patients")
    .select("id, name, user_id, birth_date")
    .limit(10);

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  // For each patient, get consultation count and last vitals
  const patientsWithHistory = await Promise.all(
    (patients ?? []).map(async (patient) => {
      const { data: consults } = await admin
        .from("consultations")
        .select("id, date, vitals")
        .eq("patient_id", patient.id)
        .order("date", { ascending: false })
        .limit(3);

      return {
        ...patient,
        consultationCount: consults?.length ?? 0,
        lastVitals: consults?.[0]?.vitals ?? null,
        lastDate: consults?.[0]?.date ?? null,
      };
    })
  );

  return NextResponse.json({ patients: patientsWithHistory });
}