import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/models/messages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { fromUser, toUser } = await req.json();

    // Find messages where the current user is the receiver and target user is the sender
    const receivedMessages = await MessageModel.find({
      toUser: fromUser,
      fromUser: toUser,
    });

    // Find messages where the current user is the sender and target user is the receiver
    const sentMessages = await MessageModel.find({
      toUser: toUser,
      fromUser: fromUser,
    });

    if (receivedMessages.length === 0 && sentMessages.length === 0) {
      return NextResponse.json(
        {
          message: "No communication between these two parties",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data retrieved successfully",
        receivedMessages,
        sentMessages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in the receiving message route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
}