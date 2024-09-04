import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const { email } = await req.json();

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: "No user found",
      }, {
        status: 401,
      });
    }

    const usersWhoLike = findUser.likeby;
    let array = [];

    for (let i = 0; i < usersWhoLike.length; i++) {
      const info = await UserModel.findById(usersWhoLike[i]);
    
      array.push(info);
    }

    return NextResponse.json({
      success: true,
      message: "Success",
      data: array,
    }, {
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Something wrong happened",
    }, {
      status: 400,
    });
  }
}