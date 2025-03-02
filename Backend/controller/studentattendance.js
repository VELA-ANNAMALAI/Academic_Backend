import { Student } from '../schema/studentschema.js';
import { StudentAttendance } from '../schema/attendanceschema.js';

// Get Students by Course,academicYear, Section, and Department
export const getStudents = async (req, res) => {
  const { course,academicYear, section, department } = req.body;

  console.log(course,academicYear, section, department )
  if (!course || !academicYear || !section || !department) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const students = await Student.find({ course,academicYear, section, department });
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};


export const submitAttendance = async (req, res) => {
  console.log(req.body, "submit");
  const { course, academicYear, section, date, attendance, courseType } = req.body;

  // Validate required fields
  if (!course || !academicYear || !section || !date || !attendance || !courseType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD format
  const [day, month, year] = date.split('-');
  const formattedDate = `${year}-${month}-${day}`;

  // Check if the current time is within the allowed range
  const currentTime = new Date();
  const startTime = new Date(currentTime);
  startTime.setHours(9, 30, 0); // 9:30 AM
  const endTime = new Date(currentTime);
  endTime.setHours(24, 0, 0); // 4:00 PM

  if (currentTime < startTime || currentTime > endTime) {
    return res.status(400).json({ error: 'Attendance can only be marked between 9:30 AM and 4:00 PM.' });
  }

  // Validate attendance array and status
  const validStatuses = ['Present', 'Absent', 'On-Duty', 'Half Day'];
  for (const { status } of attendance) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid attendance status: ${status}` });
    }
  }

  try {
    // Check if attendance already exists for the given date
    const existingAttendance = await StudentAttendance.findOne({
      course,
      academicYear,
      section,
      date: formattedDate, // Use formattedDate for comparison
      courseType,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already exists for this date' });
    }

    // Prepare attendance records
    const attendanceRecords = attendance.map(({ registerNumber, status }) => ({
      registerNumber,
      attendanceStatus: status,
    }));

    // Save attendance
    const newAttendance = new StudentAttendance({
      course,
      academicYear,
      section,
      date: formattedDate, // Use formattedDate for saving
      attendanceRecords,
      courseType,
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Attendance submitted successfully!' });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Error submitting attendance', error: error.message });
  }
};



export const getAttendanceReport = async (req, res) => {
  const { department, courseType, academicYear, section, course } = req.body;

  if (!department || !courseType || !academicYear || !section || !course) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const attendanceRecords = await StudentAttendance.find({
      'attendanceRecords.registerNumber': { $in: await Student.find({ department, courseType, academicYear, section, course }).distinct('registerno') }
    });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for the specified criteria' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ message: 'Error fetching attendance report', error: error.message });
  }
};

export const checkAttendance = async (req, res) => {
  console.log(req.body,"checkattendance");
  const { date, course, academicYear, section } = req.body;

  // Validate required fields
  if (!date || !course || !academicYear || !section ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Convert date from DD-MM-YYYY to YYYY-MM-DD
  const dateParts = date.split('-');
  const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); // Convert to YYYY-MM-DD

  if (isNaN(formattedDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Expected DD-MM-YYYY.' });
  }

  try {
    const attendanceRecord = await StudentAttendance.findOne({
      date: formattedDate,
      course,
      academicYear,
      section,
      
    });

    if (attendanceRecord) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking attendance:", error);
    res.status(500).json({ message: 'Error checking attendance', error: error.message });
  }
};

export const checkUpdateAttendance = async (req, res) => {
  console.log(req.body); // Log the incoming request body
  const { date, course, academicYear, section, department } = req.body;

  // Validate required fields
  if (!date || !course || !academicYear || !section || !department) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Convert date from DD-MM-YYYY to YYYY-MM-DD
  const dateParts = date.split('-');
  if (dateParts.length !== 3) {
    return res.status(400).json({ error: 'Invalid date format. Expected DD-MM-YYYY.' });
  }

  // Create a new Date object from the parts
  const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); // YYYY-MM-DD

  // Check if the date is valid
  if (isNaN(formattedDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Expected DD-MM-YYYY.' });
  }

  try {
    const attendanceRecord = await StudentAttendance.findOne({
      date: formattedDate, // Use the formatted date for the query
      course,
      academicYear,
      section,
      department,
    });

    if (attendanceRecord) {
      return res.status(200).json({ exists: true, message: 'Attendance record found and can be updated.' });
    }
    res.status(404).json({ exists: false, message: 'No attendance record found for the specified criteria.' });
  } catch (error) {
    console.error('Error checking attendance for update:', error);
    res.status(500).json({ message: 'Error checking attendance for update', error: error.message });
  }
};

export const updatesubmitAttendance = async (req, res) => {
  console.log("Request Body:", req.body);

  const { course, academicYear, section, courseType, date, attendance } = req.body;

  // Validate date format (DD-MM-YYYY) and convert to YYYY-MM-DD
  const dateParts = date.split('-');
  if (dateParts.length !== 3) {
    return res.status(400).json({ error: 'Invalid date format. Expected DD-MM-YYYY.' });
  }

  const [day, month, year] = dateParts;
  const formattedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`); // Convert to Date object in UTC
  console.log("Formatted Date for Query:", formattedDate);

  try {
    // Create start and end of the day for the query
    const startOfDay = new Date(formattedDate);
    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

    const query = {
      course,
      academicYear,
      section,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      courseType,
    };
    console.log("Query Parameters:", query);

    const existingAttendance = await StudentAttendance.findOne(query);
    console.log("Existing Attendance Found:", existingAttendance);

    if (existingAttendance) {
      // Update existing attendance records
      existingAttendance.attendanceRecords = attendance.map(record => ({
        registerNumber: record.registerNumber,
        attendanceStatus: record.status,
      }));

      await existingAttendance.save();
      return res.status(200).json({ message: "Attendance updated successfully!" });
    } else {
      // Create a new attendance record
      const newAttendance = new StudentAttendance({
        course,
        academicYear,
        section,
        date: formattedDate,
        attendanceRecords: attendance.map(record => ({
          registerNumber: record.registerNumber,
          attendanceStatus: record.status,
        })),
        courseType,
      });

      await newAttendance.save();
      return res.status(201).json({ message: "Attendance submitted successfully!" });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Error updating attendance", details: error.message });
  }
};