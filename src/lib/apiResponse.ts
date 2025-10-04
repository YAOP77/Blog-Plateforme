import { NextResponse } from "next/server";

export function success(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function failure(message: string, status = 500, details?: any) {
  // Ajout d'un log pour debug
  console.error("APIResponse failure:", { error: message, details });
  return NextResponse.json({ error: message, details }, { status });
}