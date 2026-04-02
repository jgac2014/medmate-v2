import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXAM_FIELD_KEYS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API_NOT_CONFIGURED" });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "INVALID_FILE_TYPE" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "application/pdf";

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const knownKeys = EXAM_FIELD_KEYS.join(", ");

  const prompt = `Você é um assistente médico. Analise o resultado de exame laboratorial neste documento e extraia os valores encontrados.

Retorne SOMENTE um JSON válido com exatamente dois campos:
- "matched": objeto onde as chaves são da lista abaixo e os valores são strings numéricas (ex: "1.2", "13.4"). Inclua APENAS os exames explicitamente presentes no documento que correspondam às chaves conhecidas. Não invente valores.
- "extras": string com os demais resultados encontrados no documento que não se encaixam nas chaves conhecidas, no formato "Nome do exame: valor unidade", um por linha. Se não houver, use string vazia "".

Chaves conhecidas: ${knownKeys}

Responda apenas com o JSON, sem markdown, sem explicações.`;

  const messageContent: Anthropic.MessageParam["content"] =
    mediaType === "application/pdf"
      ? [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64 },
          } as Anthropic.DocumentBlockParam,
          { type: "text", text: prompt },
        ]
      : [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          } as Anthropic.ImageBlockParam,
          { type: "text", text: prompt },
        ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: messageContent }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let parsed: { matched: Record<string, string>; extras: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "PARSE_ERROR" }, { status: 500 });
  }

  return NextResponse.json({ matched: parsed.matched ?? {}, extras: parsed.extras ?? "" });
}
