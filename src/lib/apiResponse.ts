import { NextResponse } from "next/server";

export function success(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function failure(message: string, status = 500, details?: unknown) {
  // Ajout d'un log pour debug
  console.error("APIResponse failure:", { error: message, details });
  return NextResponse.json({ error: message, details }, { status });
}