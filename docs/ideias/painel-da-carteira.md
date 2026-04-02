# Ideia: Painel da Carteira (Population Health Dashboard)

**Status:** Ideia registrada — não priorizada ainda
**Contexto:** Médico de UBS com carteira definida (~2.000–4.000 pacientes), usa PEC para documentação formal.

## O problema
O PEC tem relatórios populacionais mas são difíceis de usar e pouco acionáveis. O médico de família é treinado para pensar em populações, mas não tem uma ferramenta ágil para isso.

## A ideia
Uma tela fora do fluxo de consulta onde o médico visualiza sua carteira como uma população:

- "12 diabéticos sem HbA1c nos últimos 6 meses"
- "8 pacientes com follow-up vencido"
- "Cobertura de rastreamento de câncer de colo: 43%"
- Métricas de controle por condição (HAS, DM2, etc.)
- Lista de pacientes com gaps de cuidado — acionável diretamente

## Por que é forte
- Constrói sobre dados já existentes no MedMate: `patients`, `patient_problems`, `patient_medications`, `followup_items`, `preventions`
- Sem dependência de API externa
- Alta frequência de uso (entre consultas, planejamento semanal)
- PEC faz isso muito mal — diferencial real
- É o coração da medicina de família: cuidado longitudinal de população

## Limitações a considerar
- A "carteira" no MedMate só inclui pacientes já vistos pelo médico no app — não importa toda a lista territorial do PEC
- Começa pequena e cresce organicamente conforme o médico usa o app
- Requer volume mínimo de pacientes para ser útil (talvez 50+)

## Relação com features existentes
Aproveitaria diretamente:
- `patient_problems` → breakdown por condição crônica
- `patient_medications` → cobertura farmacológica
- `followup_items` → alertas de retorno vencido
- `CLINICAL_RULES` + `PREVENTIONS` → gaps de rastreamento por paciente → agregado

## Próximo passo quando priorizar
Brainstorm de spec → plano de implementação → 3–4 sessões de desenvolvimento
