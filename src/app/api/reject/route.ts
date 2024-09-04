import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId for conversion

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure dbConnect is awaited to establish the connection

  try {
    const { email, id } = await req.json();

    // Find the user by email
    const findUser = await UserModel.findOne({ email });
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

    // Check if the user exists by id
    const findId = await UserModel.findById(id);
    if (!findId) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    // Convert the string id to ObjectId
    const objectIdToRemove = new ObjectId(id);

    // Exclude the specified ObjectId from the likeby array
    findUser.likeby = findUser.likeby.filter((likeId: ObjectId) => !likeId.equals(objectIdToRemove));

    // Save the updated user document
    await findUser.save();

    return NextResponse.json(
      {
        message: "All good",
        data: findUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in both matching route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
}