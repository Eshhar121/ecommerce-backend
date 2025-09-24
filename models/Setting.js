import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
});

export default mongoose.model('Setting', settingSchema);
