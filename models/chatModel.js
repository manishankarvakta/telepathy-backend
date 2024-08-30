import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: Map,
        of: new mongoose.Schema({
            id: String,
            publicKey: String
          }),
      },
    ], // Array of user IDs
    isGroupChat: { type: Boolean, default: false }, // true for group chats
    groupName: { type: String }, // Name of the group, if it's a group chat
    ststus: {type:String, enum:["active", "blocked"]}
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;