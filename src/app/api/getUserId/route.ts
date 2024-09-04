import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    dbConnect()
  try {
    const { email } = await req.json();
  
    const findUser = await UserModel.findOne({ email:email });
  
    if (!findUser) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 401,
        }
      );
    }
  
  
    return NextResponse.json({
      success:true,
      message:"user Id",
      id:findUser._id
    },{status:200})
  } catch (error:any) {
    console.log(error.message);

    return NextResponse.json({
        success:false,
        message:"some error occur at the time of geUserId"
    },{status:400})
    
  }
}