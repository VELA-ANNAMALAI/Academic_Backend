// controllers/studentController.js
import GeneralDataStudent from '../schema/Mentorship/Generaldata.js';
import { Mentorship } from '../schema/Mentorship/StudentMentorshipReport.js';

export const getStudentGeneralData = async (req, res) => {

    console.log("general data",req.params)
  const { registerno } = req.params;

  try {
    const studentData = await GeneralDataStudent.findOne({ registerno : registerno });
    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log(studentData)
    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching general data', error });
  }
 
};

export const getStudentMentorshipData = async (req, res) => {

    console.log("report data",req.params)

  const { registerno } = req.params;

  try {
    const mentorshipData = await Mentorship.findOne({ registerNumber : registerno });
    if (!mentorshipData) {
      return res.status(404).json({ message: 'Mentorship data not found' });
    }
    res.status(200).json(mentorshipData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentorship data', error });
  }
};