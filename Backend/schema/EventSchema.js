import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  resourcePersonName: {
    type: String,
    required: true,
  },
  resourcePersonBackground: {
    type: String,
    required: true,
  },
  organizerName: {
    type: String,
    required: true,
  },
  participation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  flyer: {
    type: String, // Store the file path or URL
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;