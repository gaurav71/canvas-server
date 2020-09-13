import mongoose from 'mongoose';

const canvasSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  members: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  updatedAt: {
    type: Number,
    default: Date.now
  }
});

const Canvas = mongoose.model('Canvas', canvasSchema);

export default Canvas