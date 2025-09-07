import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  console.log("Testing Resend API key...");
  console.log("API Key exists:", !!process.env.RESEND_API_KEY);

  try {
    // Simple test email
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "test@example.com",
      subject: "Test Email",
      html: "<p>This is a test email</p>",
    });

    console.log("Resend test result:", result);

    return NextResponse.json({
      success: true,
      message: "Resend API test successful",
      result: result,
    });
  } catch (error) {
    console.error("Resend API test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Resend API test failed",
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
