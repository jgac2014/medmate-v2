"use client";

import { useEffect, useState } from "react";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import type { PatientMedication } from "@/types";

export function usePatientMedications(patientId: string | null): {
  medications: PatientMedication[];
  loading: boolean;
} {
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setMedications([]);
      return;
    }
    setLoading(true);
    getPatientMedications(patientId)
      .then((result) => {
        setMedications(result.filter((m) => m.active));
      })
      .catch(() => {
        setMedications([]);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return { medications, loading };
}