import mongoose from 'mongoose';

const { Schema } = mongoose;

const degreeSchema = new mongoose.Schema({
  department: { type: String, required: true },
  courseType: { type: String, required: true },
  courseName: { type: String, required: true },
});

// Create the Degree model
const Degree = mongoose.model('Degree', degreeSchema);

export default Degree;