import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messagin platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal thems that encourage friendly interaction. For example, your output should be stuctured like this: 'What's a hobby you've recently started?||If you could have a dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await generateText({
      model: openai("gpt-3.5-turbo"),
      maxOutputTokens: 200,
      prompt,
    });

    return NextResponse.json({
      success: true,
      suggestions: result.text,
      usage: result.usage,
    });
  } catch (error) {
    console.error("❌ Error in suggest-messages API:", error);

    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal error",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
