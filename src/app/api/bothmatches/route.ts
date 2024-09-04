import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, id } = await req.json();
    console.log(email, id);

    // Find the user by email and the target user by ID
    const findUser: User | null = await UserModel.findOne({ email });
    const findID: User | null = await UserModel.findById(id);

    if (!findUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    if (!findID) {
      return NextResponse.json(
        {
          message: "No user found with the provided ID",
        },
        {
          status: 400,
        }
      );
    }

    // Ensure _id is defined and is of the correct type
    const userId = findUser._id?.toString();
    const anotherId = findID._id?.toString();

    if (userId && anotherId) {
      // Add userId to findID's matches and anotherId to findUser's likeByMe
      findID.matches.push(userId);
      findUser.likeByMe.push(anotherId);
    } else {
      return NextResponse.json(
        {
          message: "User IDs are undefined",
        },
        {
          status: 400,
        }
      );
    }

    // Save the changes
    await findUser.save();
    await findID.save();

    return NextResponse.json(
      {
        data: findID,
        message: "Matching successful",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in matching route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500, // Changed to 500 for server errors
      }
    );
  }
}