import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String },
    displayName: { type: String },
    password: { type: String, require: true },
    address: { type: String },
    phone: { type: String, require: true, unique: true },
    isAdmin: {  type: Boolean, default: false },
    profilePicture: { type: String, default: null },
    coverPicture: { type: String },
    about: { type: String },
    livesIn: { type: String },
    worksAt: { type: String },
    relationship: { type: String },
    country: { type: String },
    followers: [],
    following: [],
    status: { type: String, enum: ["active", "inactive"] },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);
export default User;
