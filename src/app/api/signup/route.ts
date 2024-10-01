import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password, gender } = await request.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User is already registered" },
        { status: 400 }
      );
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with gender field
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      gender, // Ensure gender is stored
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
