// app/api/agent/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Caster Colony Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Caster Colony",
    version: "1.0.0"
  });
}
