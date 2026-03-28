import { createClient } from "./client";
import type { UserSnippet, SnippetCategory } from "@/types";

export async function listSnippets(
  userId: string,
  category: SnippetCategory
): Promise<UserSnippet[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_snippets")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as UserSnippet[];
}

export async function createSnippet(
  userId: string,
  fields: Pick<UserSnippet, "category" | "title" | "body">
): Promise<UserSnippet> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_snippets")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as UserSnippet;
}

export async function deleteSnippet(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_snippets")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
