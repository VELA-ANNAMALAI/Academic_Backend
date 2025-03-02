import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subCode: { type: String, required: true },
  title: { type: String, required: true },
});

const semesterSchema = new mongoose.Schema({
  semester: { type: Number, required: true }, // Numeric semester value (1, 2, 3, etc.)
  semesterName: { type: String, required: true }, // "Semester 1", "Semester 2", etc.
  subjects: [subjectSchema], // Array of subjects
});

const courseSchema = new mongoose.Schema({
  academicYear: { type: String, required: true },

  courseName: { type: String, required: true },
  semesters: [semesterSchema], // Array of semester objects
  department: { type: String, required: true },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
