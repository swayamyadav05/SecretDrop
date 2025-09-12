import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { Types } from "mongoose";
import UserModel from "@/model/User";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  if (!messageId || !Types.ObjectId.isValid(messageId)) {
    return Response.json(
      { success: false, message: "Invalid message id" },
      { status: 400 }
    );
  }
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const userId = new Types.ObjectId(user._id);
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        "messages._id": messageId,
      },
      {
        $set: { "messages.$.isRead": true },
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Message not found or unauthorized",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message marked as read",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking message as read:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
