import { createClient } from "./client";
import type { Patient } from "@/types";
import { logAuditEvent } from "./audit";

export async function searchPatients(userId: string, query: string): Promise<Patient[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .or(`name.ilike.%${query}%,cpf.ilike.%${query}%`)
    .order("name", { ascending: true })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as Patient[];
}

export async function listPatients(userId: string): Promise<Patient[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as Patient[];
}

export async function getPatientById(patientId: string): Promise<Patient | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .maybeSingle();

  if (error) throw error;
  return (data as Patient | null) ?? null;
}

export async function createPatient(
  userId: string,
  fields: Pick<Patient, "name" | "birth_date" | "gender" | "race" | "cpf" | "phone">
): Promise<Patient> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  await logAuditEvent({
    actorId: userId,
    eventType: "patient.created",
    entityType: "patient",
    entityId: data.id,
    metadata: { name: data.name },
  });
  return data as Patient;
}

export async function updatePatient(
  patientId: string,
  userId: string,
  fields: Pick<Patient, "name" | "birth_date" | "gender" | "race" | "cpf" | "phone">
): Promise<Patient> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq("id", patientId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  await logAuditEvent({
    actorId: userId,
    eventType: "patient.updated",
    entityType: "patient",
    entityId: patientId,
    metadata: { name: data.name },
  });
  return data as Patient;
}
