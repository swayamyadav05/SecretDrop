import { ApiResponse } from "./../types/ApiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "RESEND_API_KEY is not set in environment variables"
      );
      return {
        success: false,
        message: "Email service not configured",
      };
    }

    const emailData = {
      from: "SecretDrop <noreply@updates.swayamyadav.me>",
      to: [email],
      subject: "SecretDrop Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    };

    await resend.emails.send(emailData);

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
