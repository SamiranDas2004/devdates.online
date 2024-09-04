import UserModel from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { email, userId } = await req.json();
        console.log("user info",userId,email);
        
const Id=userId;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(Id)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid userId format',
            }, { status: 400 });
        }

        const objectId = new mongoose.Types.ObjectId(Id);

        // Find user by email
        const findUser = await UserModel.findOne({ email });

        if (!findUser) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, { status: 404 });
        }

        // Ensure likeby is initialized
        if (!findUser.likeby) {
            findUser.likeby = [];
        }

        // Log before update
        console.log('Before update:', findUser.likeby);

        // Update likeby array
        if (!findUser.likeby.includes(objectId)) {
            findUser.likeby.push(objectId);
        }

        // Save the updated user document
        await findUser.save();

        // Log after update
        console.log('After update:', findUser.likeby);

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            data: findUser.likeby,
        });
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during updating the user',
        }, { status: 500 });
    }
}