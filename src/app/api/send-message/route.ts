import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { messageRequestSchema } from "@/schemas/messageRequestSchema";
import z from "zod";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const validatedData = messageRequestSchema.parse(body);

    const { username, content } = validatedData;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          message: "Invalid input",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
