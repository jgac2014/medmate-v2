import type { Interaction, PrescribedDrug } from "./types";

export const INTERACTIONS: Interaction[] = [
  // ═══════════════════════════════════════════════════════════
  // INTERAÇÕES GRAVES (DANGER)
  // ═══════════════════════════════════════════════════════════

  // Opioides + CNS depressants
  { drugA: "Codeína", drugB: "Tramadol", severity: "danger", message: "Associação de opioides — risco de depressão respiratória" },
  { drugA: "Codeína", drugB: "Clonazepam", severity: "danger", message: "Opioide + benzodiazepínico — risco de depressão respiratória" },
  { drugA: "Codeína", drugB: "Diazepam", severity: "danger", message: "Opioide + benzodiazepínico — risco de depressão respiratória" },
  { drugA: "Codeína", drugB: "Alprazolam", severity: "danger", message: "Opioide + benzodiazepínico — risco de depressão respiratória" },
  { drugA: "Tramadol", drugB: "Clonazepam", severity: "danger", message: "Opioide + benzodiazepínico — risco de depressão respiratória e sedação grave" },
  { drugA: "Tramadol", drugB: "Diazepam", severity: "danger", message: "Opioide + benzodiazepínico — risco de depressão respiratória e sedação grave" },
  { drugA: "Tramadol", drugB: "Alprazolam", severity: "danger", message: "Opioide + benzodiazepínico — risco de depressão respiratória e sedação grave" },
  { drugA: "Tramadol", drugB: "Zolpidem", severity: "danger", message: "Opioide + hipnótico — risco de depressão respiratória" },

  // Benzodiazepínicos duplicados
  { drugA: "Clonazepam", drugB: "Diazepam", severity: "danger", message: "Dois benzodiazepínicos — risco aumentado de sedação e depressão respiratória" },
  { drugA: "Clonazepam", drugB: "Zolpidem", severity: "danger", message: "Benzodiazepínico + hipnótico — potencialização sedativa grave" },
  { drugA: "Diazepam", drugB: "Zolpidem", severity: "danger", message: "Benzodiazepínico + hipnótico — risco de sedação excessiva" },
  { drugA: "Alprazolam", drugB: "Zolpidem", severity: "danger", message: "Benzodiazepínico + hipnótico — risco de sedação excessiva" },

  // PDE5 + Nitratos
  { drugA: "Sildenafila", drugB: "Nitroglicerina", severity: "danger", message: "Inibidor de PDE5 + nitrato — hipotensão grave potencialmente fatal" },
  { drugA: "Tadalafila", drugB: "Nitroglicerina", severity: "danger", message: "Inibidor de PDE5 + nitrato — hipotensão grave potencialmente fatal" },

  // Metotrexato + AINEs
  { drugA: "Metotrexato", drugB: "Ibuprofeno", severity: "danger", message: "Metotrexato + AINE — redução da depuração do metotrexato, risco de toxicidade grave" },
  { drugA: "Metotrexato", drugB: "Diclofenaco", severity: "danger", message: "Metotrexato + AINE — redução da depuração do metotrexato, risco de toxicidade grave" },
  { drugA: "Metotrexato", drugB: "Naproxeno", severity: "danger", message: "Metotrexato + AINE — redução da depuração do metotrexato, risco de toxicidade grave" },
  { drugA: "Metotrexato", drugB: "Ketoprofeno", severity: "danger", message: "Metotrexato + AINE — redução da depuração do metotrexato, risco de toxicidade grave" },

  // Varfarina + anticoagulantes/antiagregantes
  { drugA: "Varfarina", drugB: "Ibuprofeno", severity: "danger", message: "Varfarina + AINE — risco aumentado de sangramento gastrointestinal" },
  { drugA: "Varfarina", drugB: "Diclofenaco", severity: "danger", message: "Varfarina + AINE — risco aumentado de sangramento gastrointestinal" },
  { drugA: "Varfarina", drugB: "Naproxeno", severity: "danger", message: "Varfarina + AINE — risco aumentado de sangramento gastrointestinal" },
  { drugA: "Varfarina", drugB: "AAS", severity: "danger", message: "Varfarina + AAS — risco aumentado de sangramento" },
  { drugA: "Varfarina", drugB: "Clopidogrel", severity: "danger", message: "Varfarina + clopidogrel — risco aumentado de sangramento" },

  // Lítio + nefrotóxicos/alteradores de clearance
  { drugA: "Litio", drugB: "Ibuprofeno", severity: "danger", message: "Litio + AINE — redução da depuração renal do lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Diclofenaco", severity: "danger", message: "Litio + AINE — redução da depuração renal do lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Naproxeno", severity: "danger", message: "Litio + AINE — redução da depuração renal do lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Hidroclorotiazida", severity: "danger", message: "Litio + diurético tiazídico — redução da depuração do lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Furosemida", severity: "danger", message: "Litio + diurético de alça — alteração dos níveis de lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Enalapril", severity: "danger", message: "Litio + IECA — aumento dos níveis de lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Losartana", severity: "danger", message: "Litio + BRA — aumento dos níveis de lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Captopril", severity: "danger", message: "Litio + IECA — aumento dos níveis de lítio, risco de toxicidade" },
  { drugA: "Litio", drugB: "Lisinopril", severity: "danger", message: "Litio + IECA — aumento dos níveis de lítio, risco de toxicidade" },

  // Digoxina + inibidores
  { drugA: "Digoxina", drugB: "Amiodarona", severity: "danger", message: "Amiodarona aumenta níveis de digoxina — reduzir dose da digoxina em 50%" },
  { drugA: "Digoxina", drugB: "Verapamil", severity: "danger", message: "Verapamil aumenta níveis de digoxina — risco de toxicidade digitálica" },
  { drugA: "Digoxina", drugB: "Espironolactona", severity: "danger", message: "Espironolactona interfere na dosagem de digoxina e aumenta seus níveis" },

  // Serotoninérgicos + Tramadol
  { drugA: "Fluoxetina", drugB: "Tramadol", severity: "danger", message: "Fluoxetina + tramadol — risco de síndrome serotoninérgica e convulsões" },
  { drugA: "Sertralina", drugB: "Tramadol", severity: "danger", message: "Sertralina + tramadol — risco de síndrome serotoninérgica e convulsões" },
  { drugA: "Venlafaxina", drugB: "Tramadol", severity: "danger", message: "Venlafaxina + tramadol — risco de síndrome serotoninérgica e convulsões" },
  { drugA: "Fluoxetina", drugB: "Amitriptilina", severity: "danger", message: "Fluoxetina inibe CYP2D6 — aumento dos níveis de amitriptilina, risco de arritmia" },
  { drugA: "Sertralina", drugB: "Amitriptilina", severity: "danger", message: "Sertralina + tricíclico — risco de síndrome serotoninérgica" },
  { drugA: "Fluoxetina", drugB: "Venlafaxina", severity: "danger", message: "Dois serotonérgicos — risco de síndrome serotoninérgica" },
  { drugA: "Sertralina", drugB: "Venlafaxina", severity: "danger", message: "Dois serotonérgicos — risco de síndrome serotoninérgica" },
  { drugA: "Bupropiona", drugB: "Tramadol", severity: "danger", message: "Bupropiona + tramadol — risco de convulsões e síndrome serotoninérgica" },

  // Macrolídeos + Estatinas
  { drugA: "Eritromicina", drugB: "Sinvastatina", severity: "danger", message: "Eritromicina + sinvastatina — risco aumentado de rabdomiólise" },
  { drugA: "Claritromicina", drugB: "Sinvastatina", severity: "danger", message: "Claritromicina + sinvastatina — risco aumentado de rabdomiólise" },
  { drugA: "Eritromicina", drugB: "Atorvastatina", severity: "danger", message: "Eritromicina + atorvastatina — risco aumentado de miopatia" },
  { drugA: "Claritromicina", drugB: "Atorvastatina", severity: "danger", message: "Claritromicina + atorvastatina — risco aumentado de miopatia" },

  // Azóis + Estatinas
  { drugA: "Cetoconazol", drugB: "Sinvastatina", severity: "danger", message: "Cetoconazol + sinvastatina — risco aumentado de rabdomiólise" },
  { drugA: "Cetoconazol", drugB: "Atorvastatina", severity: "danger", message: "Cetoconazol + atorvastatina — risco aumentado de miopatia" },

  // Rifampicina
  { drugA: "Rifampicina", drugB: "Varfarina", severity: "danger", message: "Rifampicina induz metabolismo da varfarina — redução drástica do efeito anticoagulante" },
  { drugA: "Rifampicina", drugB: "Contraceptivo", severity: "danger", message: "Rifampicina reduz eficácia de contraceptivos hormonais — usar método adicional" },

  // ═══════════════════════════════════════════════════════════
  // INTERAÇÕES MODERADAS (WARNING)
  // ═══════════════════════════════════════════════════════════

  // AINE + IECA/BRA
  { drugA: "Ibuprofeno", drugB: "Enalapril", severity: "warning", message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Ibuprofeno", drugB: "Losartana", severity: "warning", message: "AINE + BRA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Ibuprofeno", drugB: "Captopril", severity: "warning", message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Ibuprofeno", drugB: "Lisinopril", severity: "warning", message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Diclofenaco", drugB: "Enalapril", severity: "warning", message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Diclofenaco", drugB: "Losartana", severity: "warning", message: "AINE + BRA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Naproxeno", drugB: "Enalapril", severity: "warning", message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Naproxeno", drugB: "Losartana", severity: "warning", message: "AINE + BRA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Ketoprofeno", drugB: "Enalapril", severity: "warning", message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal" },
  { drugA: "Ketoprofeno", drugB: "Losartana", severity: "warning", message: "AINE + BRA — redução do efeito anti-hipertensivo e risco de lesão renal" },

  // Espironolactona + IECA/BRA (hipercalemia)
  { drugA: "Espironolactona", drugB: "Enalapril", severity: "warning", message: "Espironolactona + IECA — risco de hipercalemia. Monitorar K+ sérico." },
  { drugA: "Espironolactona", drugB: "Losartana", severity: "warning", message: "Espironolactona + BRA — risco de hipercalemia. Monitorar K+ sérico." },
  { drugA: "Espironolactona", drugB: "Captopril", severity: "warning", message: "Espironolactona + IECA — risco de hipercalemia. Monitorar K+ sérico." },
  { drugA: "Espironolactona", drugB: "Lisinopril", severity: "warning", message: "Espironolactona + IECA — risco de hipercalemia. Monitorar K+ sérico." },

  // Metformina + sulfonilureias (hipoglicemia)
  { drugA: "Metformina", drugB: "Glibenclamida", severity: "warning", message: "Metformina + sulfonilureia — risco aumentado de hipoglicemia" },
  { drugA: "Metformina", drugB: "Glimepirida", severity: "warning", message: "Metformina + sulfonilureia — risco aumentado de hipoglicemia" },
  { drugA: "Metformina", drugB: "Gliclazida", severity: "warning", message: "Metformina + sulfonilureia — risco aumentado de hipoglicemia" },

  // Metformina + contraste
  { drugA: "Metformina", drugB: "Contraste iodado", severity: "warning", message: "Metformina + contraste — suspender 48h antes de exames com contraste iodado" },

  // Metformina + iSGLT2
  { drugA: "Metformina", drugB: "Empagliflozina", severity: "warning", message: "Metformina + iSGLT2 — risco aumentado de cetoacidose euglicêmica" },

  // Omeprazol + Clopidogrel
  { drugA: "Omeprazol", drugB: "Clopidogrel", severity: "warning", message: "Omeprazol reduz eficácia do clopidogrel — preferir pantoprazol" },

  // Betabloqueador + Verapamil
  { drugA: "Propranolol", drugB: "Verapamil", severity: "warning", message: "Betabloqueador + verapamil — risco de bradicardia e bloqueio AV" },
  { drugA: "Atenolol", drugB: "Verapamil", severity: "warning", message: "Betabloqueador + verapamil — risco de bradicardia e bloqueio AV" },
  { drugA: "Carvedilol", drugB: "Verapamil", severity: "warning", message: "Betabloqueador + verapamil — risco de bradicardia e bloqueio AV" },

  // Carbamazepina + macrolídeos
  { drugA: "Carbamazepina", drugB: "Eritromicina", severity: "warning", message: "Eritromicina inibe metabolismo da carbamazepina — risco de toxicidade" },
  { drugA: "Carbamazepina", drugB: "Claritromicina", severity: "warning", message: "Claritromicina inibe metabolismo da carbamazepina — risco de toxicidade" },

  // Fenitoína + inibidores
  { drugA: "Fenitoína", drugB: "Fluoxetina", severity: "warning", message: "Fluoxetina inibe metabolismo da fenitoína — risco de toxicidade" },
  { drugA: "Fenitoína", drugB: "Omeprazol", severity: "warning", message: "Omeprazol pode aumentar níveis de fenitoína" },

  // Metronidazol + álcool
  { drugA: "Metronidazol", drugB: "Álcool", severity: "warning", message: "Metronidazol + álcool — reação dissulfiram (náusea, vômito, taquicardia)" },

  // Alfa-bloqueador + PDE5
  { drugA: "Tansulosina", drugB: "Sildenafila", severity: "warning", message: "Alfa-bloqueador + inibidor de PDE5 — risco de hipotensão ortostática" },
  { drugA: "Doxazosina", drugB: "Sildenafila", severity: "warning", message: "Alfa-bloqueador + inibidor de PDE5 — risco de hipotensão ortostática" },
  { drugA: "Prazosina", drugB: "Sildenafila", severity: "warning", message: "Alfa-bloqueador + inibidor de PDE5 — risco de hipotensão ortostática" },

  // Corticoide + AINE
  { drugA: "Dexametasona", drugB: "Ibuprofeno", severity: "warning", message: "Corticoide + AINE — risco aumentado de sangramento e úlcera gástrica" },
  { drugA: "Dexametasona", drugB: "Diclofenaco", severity: "warning", message: "Corticoide + AINE — risco aumentado de sangramento e úlcera gástrica" },
  { drugA: "Prednisona", drugB: "Ibuprofeno", severity: "warning", message: "Corticoide + AINE — risco aumentado de sangramento e úlcera gástrica" },
  { drugA: "Prednisona", drugB: "Diclofenaco", severity: "warning", message: "Corticoide + AINE — risco aumentado de sangramento e úlcera gástrica" },

  // Furosemida + AINE
  { drugA: "Furosemida", drugB: "Ibuprofeno", severity: "warning", message: "AINE reduz efeito diurético e pode causar lesão renal aguda" },
  { drugA: "Furosemida", drugB: "Diclofenaco", severity: "warning", message: "AINE reduz efeito diurético e pode causar lesão renal aguda" },
  { drugA: "Furosemida", drugB: "Naproxeno", severity: "warning", message: "AINE reduz efeito diurético e pode causar lesão renal aguda" },

  // Alopurinol + Azatioprina
  { drugA: "Alopurinol", drugB: "Azatioprina", severity: "warning", message: "Alopurinol inibe metabolismo da azatioprina — reduzir dose em 75%" },

  // Fluconazol + Warfarina/Fenitoína
  { drugA: "Fluconazol", drugB: "Varfarina", severity: "warning", message: "Fluconazol aumenta efeito da varfarina — monitorar INR" },
  { drugA: "Fluconazol", drugB: "Fenitoína", severity: "warning", message: "Fluconazol aumenta níveis de fenitoína — risco de toxicidade" },
  { drugA: "Fluconazol", drugB: "Glibenclamida", severity: "warning", message: "Fluconazol pode aumentar efeito da glibenclamida — risco de hipoglicemia" },

  // Betabloqueador mascara hipoglicemia
  { drugA: "Insulina", drugB: "Propranolol", severity: "warning", message: "Betabloqueador mascara sintomas de hipoglicemia" },
  { drugA: "Insulina", drugB: "Atenolol", severity: "warning", message: "Betabloqueador mascara sintomas de hipoglicemia" },
  { drugA: "Insulina", drugB: "Carvedilol", severity: "warning", message: "Betabloqueador mascara sintomas de hipoglicemia" },
  { drugA: "Glibenclamida", drugB: "Propranolol", severity: "warning", message: "Betabloqueador mascara sintomas de hipoglicemia induzida por sulfonilureia" },

  // ISRS + sangramento
  { drugA: "Fluoxetina", drugB: "AAS", severity: "warning", message: "ISRS + AAS — risco aumentado de sangramento gastrointestinal" },
  { drugA: "Sertralina", drugB: "AAS", severity: "warning", message: "ISRS + AAS — risco aumentado de sangramento gastrointestinal" },
  { drugA: "Fluoxetina", drugB: "Varfarina", severity: "warning", message: "Fluoxetina pode aumentar efeito da varfarina — monitorar INR" },
  { drugA: "Sertralina", drugB: "Varfarina", severity: "warning", message: "Sertralina pode aumentar efeito da varfarina — monitorar INR" },

  // Estatinas + interações
  { drugA: "Sinvastatina", drugB: "Anlodipino", severity: "warning", message: "Anlodipino + sinvastatina — limitar sinvastatina a 20mg/dia" },
  { drugA: "Sinvastatina", drugB: "Diltiazem", severity: "warning", message: "Diltiazem + sinvastatina — limitar sinvastatina a 10mg/dia" },
  { drugA: "Sinvastatina", drugB: "Verapamil", severity: "warning", message: "Verapamil + sinvastatina — limitar sinvastatina a 10mg/dia" },
  { drugA: "Sinvastatina", drugB: "Amiodarona", severity: "warning", message: "Amiodarona + sinvastatina — limitar sinvastatina a 20mg/dia" },
  { drugA: "Atorvastatina", drugB: "Amiodarona", severity: "warning", message: "Estatina + amiodarona — risco aumentado de miopatia. Limitar atorvastatina a 20mg." },

  // Fibrato + Estatina
  { drugA: "Fenofibrato", drugB: "Sinvastatina", severity: "warning", message: "Fibrato + estatina — risco aumentado de miopatia" },
  { drugA: "Fenofibrato", drugB: "Atorvastatina", severity: "warning", message: "Fibrato + estatina — risco aumentado de miopatia" },
  { drugA: "Fenofibrato", drugB: "Rosuvastatina", severity: "warning", message: "Fibrato + estatina — risco aumentado de miopatia" },

  // QT prolongado
  { drugA: "Amiodarona", drugB: "Citalopram", severity: "warning", message: "Amiodarona + citalopram — risco de QT prolongado e arritmias" },
  { drugA: "Amiodarona", drugB: "Escitalopram", severity: "warning", message: "Amiodarona + escitalopram — risco de QT prolongado e arritmias" },
  { drugA: "Ciprofloxacino", drugB: "Citalopram", severity: "warning", message: "Ciprofloxacino + citalopram — risco de QT prolongado" },
  { drugA: "Ciprofloxacino", drugB: "Escitalopram", severity: "warning", message: "Ciprofloxacino + escitalopram — risco de QT prolongado" },

  // Antipsicóticos + CNS depressants
  { drugA: "Olanzapina", drugB: "Diazepam", severity: "warning", message: "Antipsicótico + benzodiazepínico — sedação excessiva" },
  { drugA: "Olanzapina", drugB: "Clonazepam", severity: "warning", message: "Antipsicótico + benzodiazepínico — sedação excessiva" },
  { drugA: "Quetiapina", drugB: "Diazepam", severity: "warning", message: "Antipsicótico + benzodiazepínico — sedação excessiva" },
  { drugA: "Quetiapina", drugB: "Clonazepam", severity: "warning", message: "Antipsicótico + benzodiazepínico — sedação excessiva" },
  { drugA: "Quetiapina", drugB: "Tramadol", severity: "warning", message: "Quetiapina + tramadol — risco de síndrome serotoninérgica e sedação" },

  // Procinéticos
  { drugA: "Metoclopramida", drugB: "Domperidona", severity: "warning", message: "Dois procinéticos — não associar. Risco de efeitos extrapiramidais e QT prolongado." },
  { drugA: "Haloperidol", drugB: "Metoclopramida", severity: "warning", message: "Dois bloqueadores dopaminérgicos — risco de distonia e efeitos extrapiramidais" },

  // Levodopa antagonistas
  { drugA: "Levodopa", drugB: "Haloperidol", severity: "warning", message: "Haloperidol antagoniza efeito da levodopa" },
  { drugA: "Levodopa", drugB: "Metoclopramida", severity: "warning", message: "Metoclopramida antagoniza efeito da levodopa" },
  { drugA: "Levodopa", drugB: "Domperidona", severity: "warning", message: "Domperidona antagoniza efeito da levodopa" },
  { drugA: "Levodopa", drugB: "Metildopa", severity: "warning", message: "Metildopa antagoniza efeito da levodopa" },

  // Clonidina + betabloqueador
  { drugA: "Clonidina", drugB: "Propranolol", severity: "warning", message: "Interrupção abrupta de clonidina com betabloqueador — risco de crise hipertensiva" },
  { drugA: "Clonidina", drugB: "Atenolol", severity: "warning", message: "Interrupção abrupta de clonidina com betabloqueador — risco de crise hipertensiva" },

  // Ciprofloxacino + Warfarina
  { drugA: "Ciprofloxacino", drugB: "Varfarina", severity: "warning", message: "Ciprofloxacino pode aumentar efeito da varfarina — monitorar INR" },

  // Amiodarona + Warfarina
  { drugA: "Amiodarona", drugB: "Varfarina", severity: "warning", message: "Amiodarona aumenta efeito da varfarina — reduzir dose e monitorar INR" },

  // Diurético + IECA/BRA (hipotensão 1ª dose)
  { drugA: "Hidroclorotiazida", drugB: "Enalapril", severity: "warning", message: "Diurético + IECA — risco de hipotensão na primeira dose. Monitorar." },
  { drugA: "Hidroclorotiazida", drugB: "Losartana", severity: "warning", message: "Diurético + BRA — risco de hipotensão na primeira dose. Monitorar." },
  { drugA: "Furosemida", drugB: "Enalapril", severity: "warning", message: "Diurético + IECA — risco de hipotensão na primeira dose. Monitorar." },

  // Cetoconazol + Omeprazol
  { drugA: "Cetoconazol", drugB: "Omeprazol", severity: "warning", message: "Omeprazol reduz absorção do cetoconazol — separar administração" },

  // Tramadol + antidepressivos tricíclicos
  { drugA: "Tramadol", drugB: "Amitriptilina", severity: "warning", message: "Tramadol + antidepressivo tricíclico — risco de síndrome serotoninérgica" },
  { drugA: "Tramadol", drugB: "Nortriptilina", severity: "warning", message: "Tramadol + tricíclico — risco de síndrome serotoninérgica" },
  { drugA: "Tramadol", drugB: "Imipramina", severity: "warning", message: "Tramadol + tricíclico — risco de síndrome serotoninérgica" },
  { drugA: "Tramadol", drugB: "Clomipramina", severity: "warning", message: "Tramadol + tricíclico — risco de síndrome serotoninérgica" },

  // Carbamazepina + fluoxetina
  { drugA: "Carbamazepina", drugB: "Fluoxetina", severity: "warning", message: "Fluoxetina pode aumentar níveis de carbamazepina" },

  // Tenofovir + AINE
  { drugA: "Tenofovir", drugB: "Ibuprofeno", severity: "warning", message: "Tenofovir + AINE — risco aumentado de nefrotoxicidade" },
  { drugA: "Tenofovir", drugB: "Diclofenaco", severity: "warning", message: "Tenofovir + AINE — risco aumentado de nefrotoxicidade" },

  // Metformina + álcool
  { drugA: "Metformina", drugB: "Álcool", severity: "warning", message: "Metformina + álcool — risco de acidose lática. Orientar moderação." },

  // Glibenclamida + álcool
  { drugA: "Glibenclamida", drugB: "Álcool", severity: "warning", message: "Sulfonilureia + álcool — risco de reação dissulfiram e hipoglicemia" },

  // Ciprofloxacino + teofilina
  { drugA: "Ciprofloxacino", drugB: "Teofilina", severity: "warning", message: "Ciprofloxacino inibe metabolismo da teofilina — risco de toxicidade" },
];

export interface ActiveInteraction {
  severity: "warning" | "danger";
  message: string;
  drugs: [string, string];
}

export function checkInteractions(meds: PrescribedDrug[]): ActiveInteraction[] {
  const active: ActiveInteraction[] = [];

  for (let i = 0; i < meds.length; i++) {
    for (let j = i + 1; j < meds.length; j++) {
      const nameA = meds[i].name.toLowerCase();
      const nameB = meds[j].name.toLowerCase();

      for (const ix of INTERACTIONS) {
        const a = ix.drugA.toLowerCase();
        const b = ix.drugB.toLowerCase();

        const matchAB = nameA.includes(a) && nameB.includes(b);
        const matchBA = nameA.includes(b) && nameB.includes(a);

        if (matchAB || matchBA) {
          active.push({
            severity: ix.severity,
            message: ix.message,
            drugs: [meds[i].name, meds[j].name],
          });
        }
      }
    }
  }

  return active;
}
