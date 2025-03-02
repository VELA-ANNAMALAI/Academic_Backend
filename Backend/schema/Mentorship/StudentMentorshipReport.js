import mongoose from "mongoose";
const { Schema } = mongoose;

const MentorshipReport = new mongoose.Schema({
  registerNumber: { type: String, required: true },
  course: { type: String, required: true },
  issues: [
    {
      date: { type: Date, required: true },
      issue: { type: String, required: true },
      action: { type: String, required: true },
    },
  ],
});

const Mentorship = mongoose.model('MentorshipReport', MentorshipReport);
export { Mentorship };