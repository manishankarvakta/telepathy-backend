import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {type: String, required: true  },
    senderId: {type: String, required: true  },
    text: {type: {}, required: true }, // Encrypted message content
    mediaUrl: { type: String }, // URL to any attached media (optional)
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel