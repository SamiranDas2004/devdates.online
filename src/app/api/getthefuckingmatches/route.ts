import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email } = await req.json();

    // Fetch the user by email
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

    // Combine `likeByMe` and `matches` into one array
    const combinedIds = [...findUser.likeByMe, ...findUser.matches];

    // Array to store the found users
    let relatedPeople: User[] = [];

    // Iterate over the combined array and find users
    for (const id of combinedIds) {
      const user = await UserModel.findById(id);
      if (user) {
        relatedPeople.push(user);
      }
    }

    return NextResponse.json(
      {
        data: relatedPeople,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500, // Changed to 500 for server errors
      }
    );
  }
}