import mongoose from 'mongoose';

const shapeSchema = new mongoose.Schema({
  canvasId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: false
  },
  attributes: {
    type: Object,
    required: true
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

const Shape = mongoose.model('Shape', shapeSchema);

export default Shape