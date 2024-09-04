import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    let { email, data } = await req.json();

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      }, {
        status: 404,
      });
    }

    const notIncludeThis = findUser.dislikeby || [];
    const result: any[] = [];

    data.forEach((element: { _id: string }) => {
      if (!notIncludeThis.includes(element._id)) {
        result.push(element);
      }
    });

    console.log('Filtered result:', result);

    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: result,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in notinclude:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}