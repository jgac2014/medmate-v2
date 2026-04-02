# Ideia: Alertas Contextuais por Paciente

**Status:** Ideia registrada — candidata a implementação futura
**Contexto:** Médico de UBS, durante a consulta ou na abertura da ficha do paciente.

## O problema
O médico abre a consulta de um paciente mas não tem um resumo claro de "o que precisa de atenção agora" — as informações estão lá mas dispersas em vários painéis.

## A ideia
Alertas contextuais que aparecem no momento relevante:
- "Follow-up de HAS vencido há 3 meses"
- "Rastreamento de câncer de colo em atraso (última colpocitologia: 2022)"
- "HbA1c sem registro há 8 meses — paciente diabético"
- "Medicamento contínuo sem renovação há 90 dias"

## Diferença do Painel da Carteira
O painel é uma visão agregada de TODOS os pacientes (requer volume).
Os alertas contextuais aparecem DENTRO da consulta do paciente específico — não requerem volume, funcionam desde o primeiro paciente.

## Por que é forte
- Funciona desde o primeiro uso (sem necessidade de volume)
- Não exige tela/rota nova — se integra ao fluxo existente
- Usa dados já presentes: `followup_items`, `patient_problems`, `patient_medications`, `CLINICAL_RULES`, `PREVENTIONS`
- Aumenta a percepção de valor do MedMate imediatamente
- O médico sente que o app "pensa junto" com ele

## Relação com features existentes
- `followup_items` com data → alert se vencido
- `CLINICAL_RULES` + `patient_problems` → alert se regra não cumprida
- `PREVENTIONS` + última consulta → alert se rastreamento atrasado
- `patient_medications` + data → alert de renovação

## Próximo passo quando priorizar
Pode ser combinado com UX simplification no mesmo ciclo.
