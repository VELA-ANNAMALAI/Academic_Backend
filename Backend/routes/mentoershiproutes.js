import express from 'express';
import {
  getStudentsByFaculty,
  getStudentById,
  fetchMentorshipReport,
  deleteIssue,
  saveMentorshipReport,
  fetchEvaluationMarks,fetchEvaluationSubjects,getSubmittedData,submitData,getStudentDetails,createGeneralData
} from '../controller/mentorship.js';

const mentorrouter = express.Router();

// Route to get students based on faculty mentorship
mentorrouter.get('/students', getStudentsByFaculty);

// Route to get student details by ID
mentorrouter.get('/getstudentsdetails/:id', getStudentById);

// Route to fetch mentorship report by student ID
mentorrouter.get('/fetchMentorshipReport/:registerNumber', fetchMentorshipReport);

// Route to save or update mentorship report
mentorrouter.post('/MentorshipReportSave/:id', saveMentorshipReport);

// Route to delete an issue by report ID and issue ID
mentorrouter.delete('/mentorship-reports/:reportId/:issueId', deleteIssue);

mentorrouter.get('/subjects',fetchEvaluationSubjects);
mentorrouter.get('/marks',fetchEvaluationMarks);

mentorrouter.post('/submitsemesterdata/:id', submitData);
mentorrouter.get('/getsubmitteddata/:registrationNumber', getSubmittedData);

mentorrouter.get('/fetchgeneraldata/:registerno',getStudentDetails)

mentorrouter.get('creategeneraldata/newstudentcumulative',createGeneralData)



export default mentorrouter;