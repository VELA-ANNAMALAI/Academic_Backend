import mongoose from 'mongoose';

const { Schema } = mongoose;

const markSchema = new Schema({
  registerno: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  semester: { type: String, required: true, trim: true },
  examType: { type: String, required: true, trim: true },
  marks: [{
    subCode: { type: String, required: true, trim: true }, // Subject Code
    score: {
      type: Schema.Types.Mixed, // Allows both Number and String
      required: true,
      validate: {
        validator: function(value) {
          return typeof value === 'number' || value === 'A' || value === "-" || value === ""; // Accepts numbers or "A"
        },
        message: props => `${props.value} is not a valid score!`
      }
    }  }]
}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema);
export default Mark;
