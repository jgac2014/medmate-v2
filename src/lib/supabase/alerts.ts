import { createClient } from "@/lib/supabase/client";
import type { Alert, FollowUpItem } from "@/types";

/** Condições crônicas monitoradas — substrings dos textos em patient_problems */
const CHRONIC_KEYWORDS = [
  "HAS",
  "DM2",
  "Obesidade",
  "DRC",
  "Hipotireoidismo",
  "Dislipidemia",
  "Asma",
  "DPOC",
  "ICC",
  "Fibrilação Atrial",
  "Gota",
];

function formatDateBR(isoDate: string): string {
  const [y, m, d] = isoDate.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Retorna alertas clínicos contextuais para um paciente.
 * - Alerta 1: pendências não resolvidas da última consulta há mais de 30 dias
 * - Alerta 2: condição crônica ativa com última consulta há mais de 180 dias
 */
export async function getPatientAlerts(
  patientId: string,
  userId: string
): Promise<Alert[]> {
  const supabase = createClient();
  const alerts: Alert[] = [];

  // Busca a última consulta do paciente
  const { data: lastConsult } = await supabase
    .from("consultations")
    .select("id, created_at, followup_items")
    .eq("user_id", userId)
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastDate = lastConsult ? new Date(lastConsult.created_at) : null;
  const daysSince = lastDate
    ? Math.floor((Date.now() - lastDate.getTime()) / 86_400_000)
    : 999;

  // Alerta 1: pendências não resolvidas de consulta com mais de 30 dias
  if (lastConsult && daysSince > 30) {
    const items = (lastConsult.followup_items ?? []) as FollowUpItem[];
    const pending = items.filter((i) => !i.completed);
    if (pending.length > 0) {
      alerts.push({
        id: `followup-${lastConsult.id}`,
        type: "followup",
        severity: "warning",
        message: `${pending.length} pendência${pending.length > 1 ? "s" : ""} não resolvida${pending.length > 1 ? "s" : ""} da consulta de ${formatDateBR(lastConsult.created_at)}`,
      });
    }
  }

  // Alerta 2: condição crônica ativa + última consulta há mais de 180 dias
  if (daysSince > 180) {
    const { data: problems } = await supabase
      .from("patient_problems")
      .select("problem_text")
      .eq("patient_id", patientId)
      .eq("active", true);

    const chronicActive = (problems ?? [])
      .map((p) => p.problem_text)
      .filter((text) => CHRONIC_KEYWORDS.some((kw) => text.includes(kw)));

    if (chronicActive.length > 0) {
      const months = Math.floor(daysSince / 30);
      alerts.push({
        id: `chronic-${patientId}`,
        type: "chronic",
        severity: "alert",
        message: `${chronicActive[0]} ativo — última consulta há ${months} ${months === 1 ? "mês" : "meses"}`,
      });
    }
  }

  return alerts;
}
