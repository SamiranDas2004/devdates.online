import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect(); 
  try {
    const { id, email } = await req.json();

    if (!id || !email) {
      return NextResponse.json(
        { message: "ID and email are required" },
        { status: 400 }
      );
    }

    const findId = await UserModel.findOne({_id: id});
    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return NextResponse.json(
        { message: "No user found with this email" },
        { status: 400 }
      );
    }

    if (!findId) {
      return NextResponse.json(
        { message: "No user found with this ID" },
        { status: 400 }
      );
    }

    if (!findUser.matches) {
      findUser.matches = [];
    }
    
    if (!findUser.matches.includes(id)) {
      findUser.matches.push(id);
    }

    await findUser.save();

    return NextResponse.json(
      {
        message: "Match added successfully",
        data: findUser.matches,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}