import { ApiResponse } from "./../types/ApiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificaitonEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailData = {
      from: "Acme <onboarding@resend.dev>",
      to: email,
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
