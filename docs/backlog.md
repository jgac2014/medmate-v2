# MedMate — Backlog

> Última atualização: 08/04/2026

---

## Ciclo 7 — Concluído

| Sessão | Descrição | Status |
|--------|-----------|--------|
| 0 | Bug crítico: aceitar termos não abria `/consulta` (`onConflict` + RLS) | ✅ |
| 7.1 | Recuperar Prescrição, Exames, Orientações na UI; restaurar auditEvent no right panel | ✅ |
| 7.2 | Eliminar double header; botão Dashboard; Cmd+S; soft gate na finalização | ✅ |
| 7.3 | Navegação lateral funcional (scrollIntoView + IntersectionObserver); responsividade mobile | ✅ |
| 7.4 | Botões Imprimir / WhatsApp / E-mail no receituário | ✅ |
| 7.5 | Documentação e fechamento | ✅ |

---

## Ciclo 8 — Concluído (Content Expansion)

| Sessão | Descrição | Status |
|--------|-----------|--------|
| 8.1 | Auditoria de cobertura clínica — mapeou lacunas em drug-db, interactions, protocols | ✅ |
| 8.2 | Expandiu `drug-db.ts`: +14 medicamentos (bisoprolol, semaglutida, dapagliflozina, propiltiouracil, lorazepam, morfina, ácido salicílico, miconazol, roflumilaste) — total: 381 entradas | ✅ |
| 8.3 | Expandiu `interactions.ts`: +20 interações (duplo SRAA, morfina+BZD, varfarina+metronidazol, ICS+azólico, carbamazepina+varfarina, azitromicina+varfarina) — total: 162 pares | ✅ |
| 8.4 | Expandiu `protocols.ts`: +8 protocolos (constipação, pânico, bronquite aguda, urticária, tosse crônica, otite externa, conjuntivite bacteriana, anticoncepção emergência) — total: 73 protocolos | ✅ |
| 8.5 | QA: build passou, consistência entre arquivos verificada, backlog atualizado | ✅ |

---

## Backlog Geral

### Alta prioridade
- [ ] Listagem e histórico de pacientes (rota `/pacientes` não existe)
- [ ] Exportação de prontuário em PDF

### Média prioridade
- [ ] Testes automatizados (zero test files atualmente)
- [ ] Modo claro v2 (dark mode como preferência do usuário)

### Baixa prioridade
- [ ] Print CSS dedicado para receituário (`@media print`)
- [ ] Confirmação em 2 etapas no soft gate de finalização
