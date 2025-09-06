import { NextResponse } from "next/server";

export async function GET() {
  console.log("🔥 Test endpoint hit!");
  return NextResponse.json({
    success: true,
    message: "Test endpoint is working!",
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  console.log("🔥 Test POST endpoint hit!");
  return NextResponse.json({
    success: true,
    message: "Test POST endpoint is working!",
    timestamp: new Date().toISOString(),
  });
}
