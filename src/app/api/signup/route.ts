// pages/api/signup.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email,password } = await request.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User is already registered" },
        { status: 400 }
      );
    }
    const salt=10
const hashedPassword= await bcrypt.hash(password,salt)
    // Create a new user
    const newUser = await UserModel.create({
        username,
      email,
   password:hashedPassword
      // Password is not required here as it might be handled separately
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}