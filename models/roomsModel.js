import mongoose from "mongoose"

const RoomsSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    photo: { type: String},
    chatId: { type: Number, require: true },
    about: { type: String },
    photo: { type: String },
    status: { type: String, enum: ["active", "inactive"] },
  },
  {
    timestamps: true,
  }
);

const Rooms = new mongoose.model("Rooms", RoomsSchema);
export default Rooms;