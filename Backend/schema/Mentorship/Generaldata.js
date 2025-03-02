// models/student.js
import mongoose from "mongoose";
const { Schema } = mongoose;



// Submitted Data Schema
const submittedDataSchema = new mongoose.Schema({
  registerno: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  academicyear: { type: String, required: true },
  section:{type: String,required:true},

  semesterData: {
    type: Map,
    of: Map, // Nested map for semester data
  },
});

// Create models
const GeneralDataStudent = mongoose.model('GeneralDataStudent', submittedDataSchema);

export default GeneralDataStudent;