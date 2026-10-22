
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_ACTIONS = ["export-security-report"] as const;

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "INVALID_REQUEST",
        message: "Request must contain valid JSON.",
      },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      {
        error: "INVALID_REQUEST",
        message: "Expected a JSON object.",
      },
      { status: 400 }
    );
  }

  const action = (body as Record<string, unknown>).action;

  if (
    typeof action !== "string" ||
    !ALLOWED_ACTIONS.some((allowed) => allowed === action)
  ) {
    return NextResponse.json(
      {
        error: "UNKNOWN_ACTION",
        message: "This protected action is not supported.",
      },
      { status: 400 }
    );
  }

  // SECURITY: Fail closed.
  //
  // TideCloak integration will be added here.
  // Never trust a client-supplied "authenticated" flag,
  // user role, or unverified token.
  //
  // The server must validate the identity and authorization
  // before performing any sensitive operation.

  return NextResponse.json(
    {
      authorized: false,
      action,
      error: "AUTHORIZATION_REQUIRED",
      message:
        "Access denied. TideCloak authorization is not configured yet.",
    },
    {
      status: 403,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
