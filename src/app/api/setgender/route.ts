import UserModel from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    dbConnect()
   try {
     const {gender,email}=await req.json()
 
     const findUser=await UserModel.findOne({email})
     if (!findUser) {
         return NextResponse.json({
             success: false,
             message: "Login failed: User not found"
           }, {
             status: 401
           });
     }
 
     findUser.gender=gender;
 findUser.save()
     return NextResponse.json({
        success: true,
        message: "set gender successfully",
        data:findUser
      });
   } catch (error:any) {
    console.error("Error during login:", error);

    return NextResponse.json({
      success: false,
      message: "An error occurred during login"
   
    }, {
      status: 500
    });
  }
   }
