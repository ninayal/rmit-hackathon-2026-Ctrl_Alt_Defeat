
import { NextRequest, NextResponse } from "next/server";
import { classifyPrompt } from "../../../lib/classifier";

export const runtime = "nodejs";

const MAX_PROMPT_LENGTH = 10_000;

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const prompt = (body as Record<string, unknown>).prompt;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json(
      { error: "Prompt must be a non-empty string." },
      { status: 400 }
    );
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      {
        error: `Prompt must not exceed ${MAX_PROMPT_LENGTH} characters.`,
      },
      { status: 413 }
    );
  }

  try {
    const result = classifyPrompt(prompt);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to analyze the prompt." },
      { status: 500 }
    );
  }
}
