import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure dbConnect is awaited to establish the connection

  try {
    const { gender } = await req.json();

    // Find users based on gender
    const findResult = await UserModel.find({ gender });

    // If no users are found, return a 401 response
    if (!findResult || findResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Result not found",
        },
        {
          status: 401,
        }
      );
    }

    // Push findResult into a result array (if needed, but findResult is already an array)
    const result = [...findResult];

    // Return the successful response with the data
    return NextResponse.json(
      {
        success: true,
        message: "All users according to the gender",
        data: result,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error during login:", error);

    // Return a 500 error response if something goes wrong
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      {
        status: 500,
      }
    );
  }
}