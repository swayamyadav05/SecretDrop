import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const appName = process.env.APP_NAME || "SecretDrop";
    const prompt = `Create three anonymous message suggestions for ${appName}, a platform where people send honest, anonymous feedback and messages.

IMPORTANT: Return ONLY the three suggestions separated by '||' with no additional text, preamble, or explanation.

Format: suggestion1||suggestion2||suggestion3

Each suggestion should:
- Start conversations rather than ask questions
- Feel safe to share anonymously  
- Encourage meaningful, honest communication
- Be appropriate for diverse relationships

Examples:
I've always wanted to tell you that your positive energy really brightens up the room||Here's something I've noticed about you that I think you should know||I wanted to share some honest feedback that might help you grow`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      maxOutputTokens: 300,
      temperature: 0.8,
      prompt,
    });

    // Validate and fix the output - extract just the suggestions
    let suggestions = result.text.trim();

    suggestions = suggestions
      .replace(/^[\s\S]*?(?=.+?\|\|)/, "")
      .split("\n\n")[0]
      .trim();

    let suggestionsArray = suggestions
      .split("||")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (suggestionsArray.length > 3) {
      suggestionsArray = suggestionsArray.slice(0, 3);
    } else if (suggestionsArray.length < 3) {
      console.warn(
        `Only ${suggestionsArray.length} suggestions generated instead of 3`
      );
    }

    // Rejoin with || separator
    const validatedSuggestions = suggestionsArray.join("||");

    return NextResponse.json({
      success: true,
      suggestions: validatedSuggestions,
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
