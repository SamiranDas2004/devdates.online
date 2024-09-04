import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function POST(req: NextRequest) {
 await dbConnect();
  try {
    const { email, userId } = await req.json();

    const Id = userId;

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid userId format",
        },
        { status: 400 }
      );
    }

 

    if (!findUser.dislikeby) {
      findUser.dislikeby = [];
    }

    // Update dislikeby array
    if (!findUser.dislikeby.includes(Id)) {
      findUser.dislikeby.push(Id);
    }

    await findUser.save();

    return NextResponse.json({
      success: true,
      message: "User updated  successfully",
      data: findUser.dislikeby,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during updating the user",
      },
      { status: 500 }
    );
  }
}