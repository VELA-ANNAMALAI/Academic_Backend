import mongoose from 'mongoose'; // Use 'import' instead of 'require'
const { Schema } = mongoose;

const facultySchema = new mongoose.Schema({
  name: { type: String,
     required: true},
  
  Qualification: { type: String,
     required: false},

bloodGroup: {
      type: String,
    },
    
 email: {
      type: String, 
      unique: false},

  dob: { 
    type: String,
    },

  gender: { 
    type: String,
     required: false},

 phone: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    
    designation: { 
      type: String, 
      required: true},

  staffId: { 
    type: String, 
    required: true,
     unique: true},

 barcode: {
      type: String,
      match: [/^\d{10}$/, 'Barcode must be exactly 10 digits'],
    },
    
    classIncharge: { type: String,  },
  courseType: { type: String },
  course: { type: String },
  section: { type: String },
  academicYear: { type: String },

  experience: { type: Number},

  collegeName: { 
    type: String,
    },

  aadharNumber: { type: String,
      unique: false, 
      match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number'],
     },

abcId: {
      type: String,
      unique: false, // Make ABC ID unique
      match: [/^[A-Za-z0-9]{12}$/, 'Please enter a valid 12-digit ABC Id'],
    } ,
    
    nationality: {
      type: String,
    }, 
    
    religion: {
      type: String,
    },

    community: {
      type: String,
    }, 
    
    doorNo: { type: String, required: false},
  street: { type: String, required: false},
  taluk: { type: String, required: false},
  pincode: { type: String, required: false},
  state: { type: String, required: false},
  city: { type: String, required: false},
  country: { type: String, required: false},

department: {
      type: String,
    },
    
}, { timestamps: true});

// Unique index for classIncharge, course, and section
const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;