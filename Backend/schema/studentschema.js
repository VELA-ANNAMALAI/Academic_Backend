import mongoose from 'mongoose'; // Use 'import' instead of 'require'
const { Schema } = mongoose;

// Define the student schema
const studentSchema = new Schema(
  {
    // Personal information
    name: {
      type: String,
      required: true,
    },
   
    gender: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    email: { type: String, unique: true, sparse: true },
    dob: {
      type: String,
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    Nationality: {
      type: String,
      enum: ["INDIAN", "OTHER"],
    },
    Religion: {
      type: String,
      enum:  ["HINDU", "MUSLIM", "CHRISTIAN"],
    },
    Community: {
      type: String,
      enum: ["OC", "BC","MBC"],
    },
    // Academic Information
    registerno: {
      type: String,
      unique: true,
      match: [/^[A-Z0-9]+$/, 'Register number must be a combination of letters and numbers'],
    },
    barcode: { 
      type: String,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit Barcode number'],
    },
    courseType: {
      type: String,
      enum: ["UG", "PG"],
    },
    department: {
      type: String,
    },
    academicYear: {
      type: String,
      enum: [
        "2022-2025", "2023-2026", "2024-2027", // UG Academic Years
        "2023-2025", "2024-2026", // PG Academic Years
      ],
    },
    course: {
      type: String,
    },
    section: {
      type: String,
      enum: ["A", "B", "C", "D", "None"],
    },
    dayscholarOrHostel: {
      type: String,
      enum: ["DAYSCHOLAR", "HOSTEL","DAYSCHOLAR"],
    },
    busNo: {
      type: String,
    },
    busStage: {
      type: String,
    },
    hostelName: {
      type: String,
      enum: ["GANGA", "YAMUNA", "BHAVANI",""],
      default: null,
    },
    roomNumber: {
      type: String,
      default: null,
    },

    // Parent information
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    parentOccupation: {
      type: String,
    },
    parentPhone: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    
    doorno: {
      type: String,
    },
    street: {
      type: String,
    },
    taluk: {
      type: String,
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Pincode must be a valid 6-digit number'],
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },

    aadharno: {
      type: String,
      unique: false, // Make Aadhar number unique
      match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number'],
    },

    abcid: {
      type: String,
      unique: false, // Make ABC ID unique
      match: [/^[A-Za-z0-9]{12}$/, 'Please enter a valid 12-digit ABC Id'],
    },
    mentorship:{
      type: String,
    }
    
  },
  { timestamps: true }
);

// Create a model based on the schema
const Student = mongoose.model('Student', studentSchema);

// Use a named export instead of default
export { Student };