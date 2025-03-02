import express from "express";
import { addStudentController, validateStudentController } from "../controller/studentcontroll.js";
import { searchStudent, updateStudent, deleteStudent } from "../controller/studentcontroll.js";
import { updatepagesearchStudent,updatepageupdateStudent,updatepagedeleteStudent ,updateStudentByRegisterno,updateStudentpageByRegisterno } from "../controller/studentcontroll.js";
import { getFieldNames, generateXLSX, generateCSV , bulkupload, BulkStudentDataDownload, getFacultyNames,updateStudentPhotoController,photodelete,bulkUploadPhotos} from "../controller/studentcontroll.js";
import multer from 'multer';

const addstudentrouter = express.Router();
const router =express.Router();
const photorouter = express.Router();
const updatestudent =express.Router();
const upload = multer({ dest: 'uploads/' });
// Routes
addstudentrouter.post("/",upload.single('photo'), addStudentController); // POST /api/students
addstudentrouter.post("/validate", validateStudentController);
addstudentrouter.get("/facultyname",getFacultyNames);

photorouter.put('/:id/photo', upload.single('photo'), updateStudentPhotoController); // Endpoint for updating photo
photorouter.delete('/:registerno/deletephoto', photodelete); 

router.post('/bulk-upload-photos', upload.array('photos'), bulkUploadPhotos);

router.post("/search", searchStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get('/fieldnames', getFieldNames);
router.get('/generate-xlsx', generateXLSX);
router.get('/generate-csv', generateCSV);
router.post('/bulk-upload',bulkupload);
router.get('/bulk-students-dataall',BulkStudentDataDownload);

router.post("/search", searchStudent); // POST /api/students/search for searching students
router.put("/:id", updateStudent);    // PUT /api/students/:id for updating a student
router.delete("/:id", deleteStudent);

updatestudent.post("/search",updatepagesearchStudent);
updatestudent.put("/:id", updatepageupdateStudent);
updatestudent.delete("/:id",updatepagedeleteStudent);
updatestudent.get("/:registerno", updateStudentByRegisterno);
updatestudent.put("/:registerno", updateStudentpageByRegisterno);



export { addstudentrouter, router,updatestudent, photorouter };
