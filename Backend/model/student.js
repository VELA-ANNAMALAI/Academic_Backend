import { Student } from "../schema/studentschema.js";

// Add a new student to the database
export const addStudent = async (studentData) => {
  const newStudent = new Student(studentData);
  await newStudent.save();
};

// Validate if email or registerno are unique
export const validateStudent = async ({ email, registerno }) => {
  try {
    const existingStudent = await Student.findOne({
      $or: [{ email }, { registerno }],
    });
    if (existingStudent) {
      const message = existingStudent.email === email
        ? "Email already exists."
        : "Register number already exists.";
      return { isUnique: false, message };
    }
    return { isUnique: true, message: "Valid student data." };
  } catch (error) {
    throw new Error("Validation error: " + error.message);
  }
};


