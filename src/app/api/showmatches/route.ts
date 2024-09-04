import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email } = await req.json();


    // Find the user by email
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        {
          message: "No user found",
        },
        {
          status: 400,
        }
      );
    }


    // Collect all users who liked the current user
    let showAllMatches = [];
    for (const match of findUser.matches) {
      const likedByUser = await UserModel.findById(match);
    
      
      if (likedByUser) {
        showAllMatches.push(likedByUser);
      }
    }



    return NextResponse.json(
      {
        data: showAllMatches,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}