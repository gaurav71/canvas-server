import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  profileId: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  memberOfCanvas: {
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

const User = mongoose.model('User', userSchema);

export default User