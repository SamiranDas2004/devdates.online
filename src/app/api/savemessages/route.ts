import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/models/messages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect(); // Ensure the database is connected
        
        const { fromUser, toUser, message } = await req.json();
        
        let findMessageDocument = await MessageModel.findOne({ fromUser, toUser });
        
        if (!findMessageDocument) {
            // If no document is found, create a new one
            findMessageDocument = await MessageModel.create({
                fromUser,
                toUser,
                message: [message], // Initialize with the first message
                delivered:true
            });
        } else {
            // If the document exists, push the new message
            findMessageDocument.message.push(message);
            await findMessageDocument.save(); // Save the document after modification
        }
        
        return NextResponse.json({
            success: true,
            data: findMessageDocument,
        }, { status: 200 });
        
    } catch (error: any) {
        console.error("Error in the save message route:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        }, { status: 400 });
    }
}