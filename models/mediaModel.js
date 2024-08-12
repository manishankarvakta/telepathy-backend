import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true }, // URL to the stored media file
  type: { type: String, required: true }, // Type of media (image, video, etc.)
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who uploaded the media
},
{
  timestamps: true,
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;