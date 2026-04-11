import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts, LineCapStyle } from "pdf-lib";
import { BRAND } from "@/lib/branding";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PrescribedDrug {
  drugId: string;
  name: string;
  form: string;
  rxType: string;
  type: "simples" | "atb" | "ctrl";
  flag: string | null;
  posology: string;
  qty: string;
}

interface DoctorProfile {
  name: string;
  crm: string;
  specialty: string;
  address: string;
  phone: string;
  city: string;
}

interface RxPatient {
  name: string;
  cpf: string;
  address: string;
  date: string;
}

interface GeneratePdfRequest {
  meds: PrescribedDrug[];
  patient: RxPatient;
  doctor: DoctorProfile;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MM = 2.8346; // 1mm em pontos PDF

function mmToPt(mm: number): number {
  return mm * MM;
}

// Quebra texto longo em linhas respeitando maxWidth
function wrapText(text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── Gerador de Receita Simples (A5 retrato: 148mm × 210mm) ──────────────────

async function buildSimplesPage(
  pdfDoc: PDFDocument,
  meds: PrescribedDrug[],
  patient: RxPatient,
  doctor: DoctorProfile
): Promise<void> {
  // A5 em pontos
  const W = mmToPt(148);
  const H = mmToPt(210);
  const page = pdfDoc.addPage([W, H]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const marginX = mmToPt(14);
  const marginTop = mmToPt(12);
  const contentW = W - marginX * 2;

  let y = H - marginTop;

  // ── Cabeçalho do médico ───────────────────────────────────────────────────
  const doctorName = doctor.name || "Dr. Médico";

  // Nome do médico
  const nameFontSize = 14;
  page.drawText(doctorName, {
    x: marginX,
    y,
    size: nameFontSize,
    font: fontBold,
    color: rgb(0.004, 0.176, 0.114), // --primary #012d1d
  });
  y -= nameFontSize + 2;

  // Especialidade + CRM
  const descText = [doctor.specialty || "Medicina de Família e Comunidade", doctor.crm ? `CRM ${doctor.crm}` : ""]
    .filter(Boolean)
    .join(" — ");
  page.drawText(descText, {
    x: marginX,
    y,
    size: 9,
    font: fontReg,
    color: rgb(0.427, 0.478, 0.431), // --on-surface-muted
  });
  y -= 9 + 2;

  if (doctor.address) {
    const addrText = doctor.phone ? `${doctor.address} · ${doctor.phone}` : doctor.address;
    page.drawText(addrText, {
      x: marginX,
      y,
      size: 8,
      font: fontReg,
      color: rgb(0.612, 0.639, 0.612),
    });
    y -= 8 + 2;
  }

  // Linha divisória
  y -= 4;
  page.drawLine({
    start: { x: marginX, y },
    end: { x: W - marginX, y },
    thickness: 0.5,
    color: rgb(0.757, 0.784, 0.757), // --outline-variant
    lineCap: LineCapStyle.Round,
  });
  y -= 10;

  // ── Título + data ─────────────────────────────────────────────────────────
  page.drawText("RECEITUÁRIO SIMPLES", {
    x: marginX,
    y,
    size: 8,
    font: fontBold,
    color: rgb(0.427, 0.478, 0.431),
  });
  const dateText = patient.date || new Date().toLocaleDateString("pt-BR");
  const dateW = fontReg.widthOfTextAtSize(dateText, 8);
  page.drawText(dateText, {
    x: W - marginX - dateW,
    y,
    size: 8,
    font: fontReg,
    color: rgb(0.427, 0.478, 0.431),
  });
  y -= 14;

  // ── Paciente ──────────────────────────────────────────────────────────────
  page.drawText("Paciente: ", {
    x: marginX,
    y,
    size: 9,
    font: fontReg,
    color: rgb(0.427, 0.478, 0.431),
  });
  page.drawText(patient.name || "_________________________________", {
    x: marginX + fontReg.widthOfTextAtSize("Paciente: ", 9),
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.09, 0.11, 0.12),
  });
  y -= 11;

  if (patient.address) {
    page.drawText(`Endereço: ${patient.address}`, {
      x: marginX,
      y,
      size: 8,
      font: fontReg,
      color: rgb(0.427, 0.478, 0.431),
    });
    y -= 10;
  }
  y -= 6;

  // ── Medicamentos ──────────────────────────────────────────────────────────
  const lineSpacing = 14;
  const subLineSpacing = 10;

  for (let i = 0; i < meds.length; i++) {
    const med = meds[i];
    const numText = `${i + 1}. `;
    const numW = fontBold.widthOfTextAtSize(numText, 10);

    // Nome + quantidade
    const medLine = med.qty ? `${med.name} — ${med.qty}` : med.name;
    const medLines = wrapText(medLine, fontBold, 10, contentW - numW);

    for (let li = 0; li < medLines.length; li++) {
      if (li === 0) {
        page.drawText(numText, { x: marginX, y, size: 10, font: fontBold, color: rgb(0.09, 0.11, 0.12) });
      }
      page.drawText(medLines[li], {
        x: marginX + (li === 0 ? numW : numW),
        y,
        size: 10,
        font: li === 0 ? fontBold : fontReg,
        color: rgb(0.09, 0.11, 0.12),
      });
      y -= lineSpacing;
    }

    // Posologia
    if (med.posology) {
      const posLines = wrapText(med.posology, fontReg, 9, contentW - numW - 4);
      for (const pl of posLines) {
        page.drawText(pl, {
          x: marginX + numW + 4,
          y,
          size: 9,
          font: fontReg,
          color: rgb(0.302, 0.345, 0.310),
        });
        y -= subLineSpacing;
      }
    }
    y -= 4;
  }

  // ── Assinatura ────────────────────────────────────────────────────────────
  const sigY = mmToPt(20);
  const sigW = mmToPt(50);
  const sigX = W - marginX - sigW;

  page.drawLine({
    start: { x: sigX, y: sigY + 14 },
    end: { x: sigX + sigW, y: sigY + 14 },
    thickness: 0.5,
    color: rgb(0.757, 0.784, 0.757),
    lineCap: LineCapStyle.Round,
  });
  const sigLabel = "Assinatura e Carimbo";
  const sigLabelW = fontReg.widthOfTextAtSize(sigLabel, 8);
  page.drawText(sigLabel, {
    x: sigX + (sigW - sigLabelW) / 2,
    y: sigY + 4,
    size: 8,
    font: fontReg,
    color: rgb(0.612, 0.639, 0.612),
  });
}

// ─── Gerador de Receita de Controle Especial (A4 retrato: 210mm × 297mm) ─────

async function buildControleEspecialPage(
  pdfDoc: PDFDocument,
  meds: PrescribedDrug[],
  patient: RxPatient,
  doctor: DoctorProfile,
  pageTitle = "RECEITUÁRIO DE CONTROLE ESPECIAL",
  pageSubtitle = "Notificação de Receita — 2 vias"
): Promise<void> {
  const W = mmToPt(210);
  const H = mmToPt(297);
  const page = pdfDoc.addPage([W, H]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const marginX = mmToPt(15);
  const marginTop = mmToPt(15);
  const contentW = W - marginX * 2;

  let y = H - marginTop;

  // ── Cabeçalho: tabela 2 colunas (55% / 45%) ──────────────────────────────
  const col1W = contentW * 0.55;
  const col2W = contentW * 0.45;
  const headerH = mmToPt(26);

  // Borda da tabela
  page.drawRectangle({
    x: marginX,
    y: y - headerH,
    width: contentW,
    height: headerH,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  });
  // Divisão interna coluna
  page.drawLine({
    start: { x: marginX + col1W, y: y - headerH },
    end: { x: marginX + col1W, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Coluna 1 — identificação do médico
  let cx = marginX + mmToPt(3);
  let cy = y - mmToPt(4);
  page.drawText("IDENTIFICAÇÃO DO EMITENTE", {
    x: cx, y: cy, size: 7, font: fontBold,
    color: rgb(0.427, 0.478, 0.431),
  });
  cy -= 10;
  page.drawText(doctor.name || "Dr. Médico", {
    x: cx, y: cy, size: 11, font: fontBold,
    color: rgb(0.004, 0.176, 0.114),
  });
  cy -= 9;
  const descText = [doctor.specialty || "Medicina de Família e Comunidade", doctor.crm ? `CRM ${doctor.crm}` : ""]
    .filter(Boolean).join(" — ");
  page.drawText(descText, { x: cx, y: cy, size: 8, font: fontReg, color: rgb(0.427, 0.478, 0.431) });
  if (doctor.address) {
    cy -= 8;
    page.drawText(doctor.address, { x: cx, y: cy, size: 7, font: fontReg, color: rgb(0.612, 0.639, 0.612) });
  }

  // Coluna 2 — título + data + vias
  let cx2 = marginX + col1W + mmToPt(3);
  let cy2 = y - mmToPt(4);
  page.drawText(pageTitle, {
    x: cx2, y: cy2, size: 9, font: fontBold,
    color: rgb(0.09, 0.11, 0.12),
  });
  cy2 -= 9;
  page.drawText(pageSubtitle, {
    x: cx2, y: cy2, size: 7, font: fontReg,
    color: rgb(0.427, 0.478, 0.431),
  });
  cy2 -= 10;
  page.drawText("DATA", { x: cx2, y: cy2, size: 7, font: fontReg, color: rgb(0.427, 0.478, 0.431) });
  cy2 -= 8;
  page.drawText(patient.date || new Date().toLocaleDateString("pt-BR"), {
    x: cx2, y: cy2, size: 9, font: fontBold,
    color: rgb(0.09, 0.11, 0.12),
  });

  y -= headerH + mmToPt(5);

  // ── Paciente ──────────────────────────────────────────────────────────────
  page.drawText("Paciente: ", { x: marginX, y, size: 9, font: fontReg, color: rgb(0.427, 0.478, 0.431) });
  page.drawText(patient.name || "_________________________________", {
    x: marginX + fontReg.widthOfTextAtSize("Paciente: ", 9),
    y, size: 9, font: fontBold,
    color: rgb(0.09, 0.11, 0.12),
  });
  y -= 12;

  if (patient.address) {
    page.drawText(`Endereço: ${patient.address}`, { x: marginX, y, size: 8, font: fontReg, color: rgb(0.427, 0.478, 0.431) });
    y -= 10;
  }
  y -= 4;

  // ── Label prescrição ──────────────────────────────────────────────────────
  page.drawText("PRESCRIÇÃO:", { x: marginX, y, size: 8, font: fontBold, color: rgb(0.09, 0.11, 0.12) });
  y -= 12;

  // ── Medicamentos ──────────────────────────────────────────────────────────
  for (let i = 0; i < meds.length; i++) {
    const med = meds[i];
    const numText = `${i + 1}. `;
    const numW = fontBold.widthOfTextAtSize(numText, 10);
    const medLine = med.qty ? `${med.name} — ${med.qty}` : med.name;
    const medLines = wrapText(medLine, fontBold, 10, contentW - numW);

    for (let li = 0; li < medLines.length; li++) {
      if (li === 0) page.drawText(numText, { x: marginX, y, size: 10, font: fontBold, color: rgb(0.09, 0.11, 0.12) });
      page.drawText(medLines[li], {
        x: marginX + numW,
        y, size: 10,
        font: li === 0 ? fontBold : fontReg,
        color: rgb(0.09, 0.11, 0.12),
      });
      y -= 13;
    }
    if (med.posology) {
      const posLines = wrapText(med.posology, fontReg, 9, contentW - numW - 4);
      for (const pl of posLines) {
        page.drawText(pl, { x: marginX + numW + 4, y, size: 9, font: fontReg, color: rgb(0.302, 0.345, 0.310) });
        y -= 10;
      }
    }
    y -= 4;
  }

  // ── Assinatura ────────────────────────────────────────────────────────────
  const sigY = mmToPt(40);
  const sigW = mmToPt(55);
  const sigX = W - marginX - sigW;
  page.drawLine({
    start: { x: sigX, y: sigY + 14 },
    end: { x: sigX + sigW, y: sigY + 14 },
    thickness: 0.5,
    color: rgb(0.757, 0.784, 0.757),
  });
  const sigLabel = "Assinatura e Carimbo do Médico";
  const sigLabelW = fontReg.widthOfTextAtSize(sigLabel, 7);
  page.drawText(sigLabel, {
    x: sigX + (sigW - sigLabelW) / 2,
    y: sigY + 4,
    size: 7, font: fontReg,
    color: rgb(0.612, 0.639, 0.612),
  });

  // ── Rodapé: tabela identificação comprador / fornecedor ───────────────────
  const footerH = mmToPt(28);
  const footerY = mmToPt(10);

  page.drawRectangle({
    x: marginX, y: footerY,
    width: contentW, height: footerH,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  });
  page.drawLine({
    start: { x: marginX + col1W, y: footerY },
    end: { x: marginX + col1W, y: footerY + footerH },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Col 1 — comprador
  let fy = footerY + footerH - mmToPt(4);
  page.drawText("IDENTIFICAÇÃO DO COMPRADOR", {
    x: marginX + mmToPt(2), y: fy,
    size: 7, font: fontBold,
    color: rgb(0.427, 0.478, 0.431),
  });
  fy -= 9;
  for (const line of ["Nome: _________________________________", "RG/CPF: _________________________________", "End.: __________________________________", "Tel.: ___________ Cidade: _______________"]) {
    page.drawText(line, { x: marginX + mmToPt(2), y: fy, size: 7, font: fontReg, color: rgb(0.09, 0.11, 0.12) });
    fy -= 8;
  }

  // Col 2 — fornecedor
  let fy2 = footerY + footerH - mmToPt(4);
  page.drawText("IDENTIFICAÇÃO DO FORNECEDOR", {
    x: marginX + col1W + mmToPt(2), y: fy2,
    size: 7, font: fontBold,
    color: rgb(0.427, 0.478, 0.431),
  });
  fy2 -= 9;
  for (const line of ["Farmácia: _______________________________", "CNPJ: __________________________________", "Data: ____________ Nº: __________________", "Assinatura Farmacêutico: _________________"]) {
    page.drawText(line, { x: marginX + col1W + mmToPt(2), y: fy2, size: 7, font: fontReg, color: rgb(0.09, 0.11, 0.12) });
    fy2 -= 8;
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: GeneratePdfRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { meds, patient, doctor } = body;
  if (!meds || !Array.isArray(meds) || meds.length === 0) {
    return NextResponse.json({ error: "NO_MEDS" }, { status: 400 });
  }

  // Agrupa por rxType conforme ANVISA RDC 20/2011, Portaria 344/1998 + RDC 471/2021
  const simplesMeds  = meds.filter((m) => m.rxType === "Receita Simples");
  const atbMeds      = meds.filter((m) => m.rxType === "Receita Antimicrobiana");         // RDC 20/2011 — 2 vias, farmácia retém 1
  const brancaMeds   = meds.filter((m) => m.rxType === "Notificação de Receita B");       // Lista B1/B2
  const ctrlMeds     = meds.filter((m) => m.rxType === "Receita de Controle Especial");   // Lista C1/C3
  const amarelaMeds  = meds.filter((m) => m.rxType === "Notificação Especial Amarela");   // Lista A1/A2/A3
  const azulMeds     = meds.filter((m) => m.rxType === "Receita Azul");                   // Lista C5

  const hasCtrl = atbMeds.length > 0 || brancaMeds.length > 0 || ctrlMeds.length > 0 || amarelaMeds.length > 0 || azulMeds.length > 0;

  // Fallback: rxType nao reconhecido ou ausente → trata como Receita Simples
  const effectiveSimples = simplesMeds.length > 0
    ? simplesMeds
    : !hasCtrl ? meds : [];

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Receita Médica — ${BRAND.name}`);
  pdfDoc.setAuthor(doctor?.name || BRAND.name);
  pdfDoc.setCreationDate(new Date());

  if (effectiveSimples.length > 0) {
    await buildSimplesPage(pdfDoc, effectiveSimples, patient, doctor);
  }
  if (atbMeds.length > 0) {
    await buildControleEspecialPage(pdfDoc, atbMeds, patient, doctor,
      "RECEITA ANTIMICROBIANA", "Farmácia retém uma via — Válida por 10 dias (RDC 20/2011)");
  }
  if (brancaMeds.length > 0) {
    await buildControleEspecialPage(pdfDoc, brancaMeds, patient, doctor,
      "NOTIFICAÇÃO DE RECEITA B", "Notificação de Receita B (Branca) — 2 vias");
  }
  if (ctrlMeds.length > 0) {
    await buildControleEspecialPage(pdfDoc, ctrlMeds, patient, doctor,
      "RECEITA DE CONTROLE ESPECIAL", "Receita de Controle Especial — 2 vias");
  }
  if (amarelaMeds.length > 0) {
    await buildControleEspecialPage(pdfDoc, amarelaMeds, patient, doctor,
      "NOTIFICAÇÃO ESPECIAL AMARELA", "Notificação de Receita A — Talonário");
  }
  if (azulMeds.length > 0) {
    await buildControleEspecialPage(pdfDoc, azulMeds, patient, doctor,
      "RECEITA DE CONTROLE ESPECIAL AZUL", "Receita de Controle Especial — 2 vias");
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receita-${patient.name?.replace(/\s+/g, "-").toLowerCase() || "medmate"}-${new Date().toISOString().split("T")[0]}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
