import express from "express";
import { addFaculty,getFacultyDetails,validateFaculty,updateFaculty,deleteFaculty,searchStaff,updateFacultyPage,updateFacultyById } from "../controller/facultycontroller.js";
import { getFieldNames,generateXLSX,generateCSV,bulkupload,BulkFacultyDataDownload } from "../controller/facultycontroller.js";

const addfacultyrouter = express.Router();

// Route for adding faculty
addfacultyrouter.post("/addfaculty", addFaculty);

// Route for validating faculty data (e.g., for unique checks)
addfacultyrouter.post("/addfaculty/validate", validateFaculty);

const staffrouter = express.Router();


staffrouter.post("/search", searchStaff); // Route to search staff
staffrouter.put("/:id", updateFacultyById); // Route to update staff
staffrouter.delete("/:id", deleteFaculty);
staffrouter.get("/:staffId", getFacultyDetails);

const staffrouter1 = express.Router();

staffrouter1.put('/faculty/:staffId', updateFacultyPage);
staffrouter1.put('/:id', updateFacultyById);

const router1 = express.Router();


router1.get('/fieldnames', getFieldNames);
router1.get('/generate-xlsx', generateXLSX);
router1.get('/generate-csv', generateCSV);
router1.post('/bulk-upload',bulkupload);
router1.get('/bulk-faculty-dataall',BulkFacultyDataDownload);

export {addfacultyrouter,staffrouter,staffrouter1,router1};
