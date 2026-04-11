"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useConsultationStore } from "@/stores/consultation-store";
import {
  calculateTFG,
  calculateFIB4,
  calculateRCV,
  calculateLDL,
  calculateNaoHDL,
} from "@/lib/calculations";

/**
 * Hook que encapsula todos os efeitos de cálculo automático da seção de exames.
 * Usa seletores shallow para evitar re-renders desnecessários.
 * Deve ser montado uma única vez — no ExamGrid.
 */
export function useExamCalculations() {
  const { cr, ct, hdl, trig, ast, alt, plaq, rac } = useConsultationStore(
    useShallow((s) => ({
      cr:   s.labs.cr   ?? "",
      ct:   s.labs.ct   ?? "",
      hdl:  s.labs.hdl  ?? "",
      trig: s.labs.trig ?? "",
      ast:  s.labs.ast  ?? "",
      alt:  s.labs.alt  ?? "",
      plaq: s.labs.plaq ?? "",
      rac:  s.labs.rac  ?? "",
    }))
  );

  const { age, gender } = useConsultationStore(
    useShallow((s) => ({ age: s.patient.age, gender: s.patient.gender }))
  );

  const { pas } = useConsultationStore(useShallow((s) => ({ pas: s.vitals.pas })));

  const problems = useConsultationStore(useShallow((s) => s.problems));

  const setLab = useConsultationStore((s) => s.setLab);
  const setCalculations = useConsultationStore((s) => s.setCalculations);

  // ─── TFG CKD-EPI 2021 ────────────────────────────────────────────────────────
  useEffect(() => {
    const crNum = parseFloat(cr);
    const ageNum = parseInt(age);
    const uacr = parseFloat(rac);

    if (
      !isNaN(crNum) && crNum > 0 &&
      !isNaN(ageNum) && ageNum >= 18 &&
      (gender === "Masculino" || gender === "Feminino")
    ) {
      const result = calculateTFG(
        crNum,
        ageNum,
        gender,
        !isNaN(uacr) && uacr > 0 ? uacr : undefined
      );
      if (result) {
        setLab("tfg", `${result.value} — ${result.stage}`);
        setCalculations({ tfg: result });
        return;
      }
    }
    setLab("tfg", "");
    setCalculations({ tfg: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cr, rac, age, gender]);

  // ─── FIB-4 ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const ageNum  = parseInt(age);
    const astNum  = parseFloat(ast);
    const altNum  = parseFloat(alt);
    const plaqNum = parseFloat(plaq);

    if (
      !isNaN(ageNum) && ageNum > 0 &&
      !isNaN(astNum)  && astNum > 0 &&
      !isNaN(altNum)  && altNum > 0 &&
      !isNaN(plaqNum) && plaqNum > 0
    ) {
      const result = calculateFIB4(ageNum, astNum, altNum, plaqNum);
      if (result) {
        setCalculations({ fib4: result });
        return;
      }
    }
    setCalculations({ fib4: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, ast, alt, plaq]);

  // ─── RCV (Framingham/ERG) ─────────────────────────────────────────────────────
  useEffect(() => {
    const ageNum = parseInt(age);
    const pasNum = parseFloat(pas);
    const ctNum  = parseFloat(ct);
    const hdlNum = parseFloat(hdl);

    if (
      !isNaN(ageNum) &&
      !isNaN(pasNum) && pasNum > 0 &&
      !isNaN(ctNum)  && ctNum > 0 &&
      !isNaN(hdlNum) && hdlNum > 0 &&
      (gender === "Masculino" || gender === "Feminino")
    ) {
      const tabagismo = problems.includes("Tabagismo");
      const dm        = problems.includes("DM2");
      const has       = problems.includes("HAS");
      const result = calculateRCV(ageNum, pasNum, ctNum, hdlNum, gender, tabagismo, dm, has);
      if (result) {
        setCalculations({ rcv: result });
        return;
      }
    }
    setCalculations({ rcv: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, pas, ct, hdl, gender, problems]);

  // ─── LDL (Friedewald) + Não-HDL ──────────────────────────────────────────────
  useEffect(() => {
    const ctNum   = parseFloat(ct);
    const hdlNum  = parseFloat(hdl);
    const trigNum = parseFloat(trig);

    // Não-HDL: só precisa de CT e HDL
    if (!isNaN(ctNum) && ctNum > 0 && !isNaN(hdlNum) && hdlNum > 0) {
      const naoHdlResult = calculateNaoHDL(ctNum, hdlNum);
      setLab("nao_hdl", naoHdlResult ? `${naoHdlResult.value}` : "");
      setCalculations({ naoHdl: naoHdlResult });
    } else {
      setLab("nao_hdl", "");
      setCalculations({ naoHdl: null });
    }

    // LDL Friedewald: precisa de CT, HDL e TG < 400
    if (
      !isNaN(ctNum)   && ctNum > 0 &&
      !isNaN(hdlNum)  && hdlNum > 0 &&
      !isNaN(trigNum) && trigNum > 0
    ) {
      if (trigNum >= 400) {
        // Campo ldl fica vazio; mensagem exibida via AutoResult no card
        setLab("ldl", "");
        setLab("ldl_tg_alto", "1"); // flag para exibir aviso no card
        setCalculations({ ldl: null });
      } else {
        const ldlResult = calculateLDL(ctNum, hdlNum, trigNum);
        setLab("ldl", ldlResult ? `${ldlResult.value}` : "");
        setLab("ldl_tg_alto", "");
        setCalculations({ ldl: ldlResult });
      }
    } else {
      setLab("ldl", "");
      setLab("ldl_tg_alto", "");
      setCalculations({ ldl: null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ct, hdl, trig]);
}
