import Faculty from "../schema/facultyschema.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt"; // Import bcrypt

export const login = async (req, res) => {
  console.log("Received in Backend:", req.body);

  const { staffId, password } = req.body;

  try {
    // Find faculty by name
    const faculty = await Faculty.findOne({ name: staffId });

    if (!faculty) {
      console.log("Faculty not found");
      return res.status(404).json({ message: "Faculty not found" });
    }

    console.log("Database Record Found:", faculty);
    console.log("Stored Staff ID (Password):", faculty.staffId);
    console.log("Entered Password:", password);

    // Check if password (staffId) matches
    if (faculty.staffId.trim() === password.trim()) {
      const token = generateToken(faculty._id);
      faculty.currentSessionToken = token;
      await faculty.save();

      return res.status(200).json({
        message: "Faculty login successful",
        token,
        facultyData: {
          name: faculty.name,
          staffId: faculty.staffId,
          designation: faculty.designation,
          department: faculty.department,
          collegeName: faculty.collegeName,
        },
      });
    } else {
      console.log("Invalid Credentials - Password Mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};