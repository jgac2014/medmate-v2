import { createClient } from "./client";
import type { Patient } from "@/types";

export async function searchPatients(userId: string, query: string): Promise<Patient[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as Patient[];
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
  return data as Patient;
}
