import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attendanceRecords: [
    {
      registerNumber: {
        type: String,
        required: true,
      },
      attendanceStatus: {
        type: String,
        enum: ["Present", "Absent", "On-Duty", "Half Day"],
        required: true,
      },
    },
  ],
});

const StudentAttendance = mongoose.model('Attendance', attendanceSchema);

export { StudentAttendance };