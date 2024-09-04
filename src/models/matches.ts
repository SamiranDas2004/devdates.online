// import mongoose, { Schema, Document, Model } from "mongoose";

// // Interface for Matches Document
// export interface Matches extends Document {
//   likeBy: mongoose.Types.ObjectId;
//   likeTO: mongoose.Types.ObjectId;
// }

// // Define the Matches Schema
// const MatchesSchema: Schema<Matches> = new Schema({
//   likeBy: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   }],
//   likeTO: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
// });


// // Define and export the Matches Model
// const MatchesModel =
//   (mongoose.models.Matches as Model<Matches>) ||
//   mongoose.model<Matches>("Matches", MatchesSchema);

// export default MatchesModel;
