import { track } from "@vercel/analytics";

/**
 * Eventos de produto rastreados no funil de ativação.
 * Utilizados para identificar onde usuários abandonam o fluxo.
 */
export type ProductEvent =
  | "signup_completed"     // Cadastro concluído
  | "patient_created"      // Primeiro (ou qualquer) paciente criado
  | "consultation_started" // Consulta iniciada (paciente selecionado)
  | "summary_copied"       // Resumo copiado para o eSUS
  | "timer_started"        // Cronômetro de consulta iniciado
  | "timer_paused"         // Cronômetro pausado
  | "timer_resumed"        // Cronômetro retomado
  | "timer_completed";     // Cronômetro finalizado

export function trackEvent(
  event: ProductEvent,
  props?: Record<string, string | number | boolean>
): void {
  try {
    track(event, props);
  } catch {
    // Silencioso em dev/sem consentimento — nunca quebra o fluxo clínico
  }
}
