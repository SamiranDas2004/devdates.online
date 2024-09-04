import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { Photos } from "@/helper/cloudinary";

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const photos = formData.getAll('photos') as File[];

    const uploadPromises = photos.map(async (photo) => {
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await Photos(buffer);
      return url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    const user: any = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    user.photos = user.photos.concat(imageUrls);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Photo(s) uploaded successfully',
      imageUrls,
    });
  } catch (error) {
    console.error('Error uploading photos:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during photo upload',
    }, { status: 500 });
  }
}