import mongoose, { Schema, Document, Model } from "mongoose";

export interface Message extends Document {
  fromUser: string;
  toUser: string;
  message: string[];
  timestamp: Date;
  delivered: boolean;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    fromUser: {
      type: String,
      required: true, 
    },
    toUser: {
      type: String,
      required: true, 
    },
    message: [
      {
        type: String,
        required: true, 
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now, 
    },
    delivered: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const MessageModel = 
  (mongoose.models.Message as Model<Message>) ||
  mongoose.model<Message>('Message', MessageSchema);

export default MessageModel;