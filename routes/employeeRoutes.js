const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const path = require('path');

const {
  createNewEmployee,
  // createDepartment,
  getAllEmployee,
  getAllEmployeePerProject,
  getAllEmployeePerProjectR,
  getAllEmployeePerDepartment,
  getOneEmployeePerProject,
  getEmployeeAttendancePerProject,
  getEmployeeRedundancy,
  getEmployeeGhostPerProject,
  getEmployeeRedundancyPerProject,
  getTotalEmployee,
  getOneEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeDetail,
  getOneEmployeeLabel,
  getEmployeeLabelPerProject,
  getEmployeeLabelSPerProject,
  getEmployeeLabelS,
  overtimeReset,
  allowanceAdder,
  allowanceReset,
  overtimeResetMany,
  getEmployeeAttendance,
  getGhostEmployeeAttendance,
  SumOfAttendances,
  AddScore,
  SubScore,
  AddComplainScore,
  ComplainStatus,
  reviewComplain,
  numberPerDepartment,
  getEmployeeAttendancePreviousDay,
  overtimeAdder,
  IOU,
  archieve,
  createPayroll,
  getAllDesignation,
  shortlisted,
  getShortlisted,
  addLoan,
  updateLoan,
  connectEmployeerPortal,
  PortalAccess,
} = require('../controller/employee');

router.route('/newDesignation').post(createPayroll);
router.route('/create/:id').post(createNewEmployee);
router.route('/employees/:userEmail').get(getAllEmployee);
router.route('/designation/:email').get(getAllDesignation);
router.route('/detail/:id').get(getEmployeeDetail);
router.route('/add-loan').post(addLoan);
router.route('/update-loan').post(updateLoan);
router.route('/updateComplain/:date').post(reviewComplain);
router.route('/complain-status/:id/:dueDate/:date/:label/:detail').get(ComplainStatus);
router.route('/all/mark/:email/:date/:label').get(getEmployeeLabelS);
router.route('/mark/:date/:employeeId/:label').get(getOneEmployeeLabel);  
router.route('/all-attendance/:email/:dateOffset').get(getEmployeeAttendance);
router.route('/overtimeAdder/:id/:value').post(overtimeAdder);
router.route('/allowance/:id/:value').post(allowanceAdder);
router.route('/IOU/:id/:value').post(IOU);


// // router
// // .route('/create/:id/:projectname')
// // .post(createDepartment)

// router.route('/shortlist/:id/:projectname').post(shortlisted);

// router.route('/payroll/:email/:projectname').get(getAllPayroll);

// router.route('/employees/:useEmail').get(getAllEmployee); // All employee

// router.route('/shortlist/:projectname').get(getShortlisted);

// router.route('/:email/:projectname').get(getAllEmployeePerProject);

// router.route('/department/:email/:projectname/:unit').get(getAllEmployeePerDepartment);

// router.route('/gallery/:email/:projectname').get(getAllEmployeePerProjectR);

// router.route('/update-employ/1/:id/:projectname').post(updateEmployee);

// router.route('/archieve/:id').post(archieve);

// router.route('/overtimeAdder/:id/:overtime').post(overtimeAdder);

// router.route('/allowance/:id/:allowance').post(allowanceAdder);

// router.route('/overtimeReset/:email/:projectname/:overtime').post(overtimeReset);
// router.route('/overtimeReset/:email/:projectname/:overtime').post(allowanceReset);

// router.route('/total/:email/:projectname').get(getTotalEmployee);

// // router
// // .route('/:id')
// // .get(getOneEmployee)

// router.route('/1/:id/:projectname').get(getOneEmployeePerProject);

;

// router.route('/redun/:email/:projectname').get(getEmployeeRedundancyPerProject);

// router.route('/ghost/:email/:projectname').get(getEmployeeGhostPerProject);

// router.route('/attendance/:email/:projectname/:dateOffset').get(getEmployeeAttendancePerProject);

// router.route('/attendance/1day/:email/:projectname/:dateOffset').get(getEmployeeAttendancePreviousDay);

// router.route('/delete/:id').delete(deleteEmployee);

// //   router
// // .route('/mark/:id/:date/:label/:projectname')
// // .get(getEmployeeLabel)

// router.route('/mark/:id/:date/:label').get(getEmployeeLabelPerProject);

// // router
// // .route('/all/mark/:email/:date/:label')
// // .get(getEmployeeLabelS);

// router
//   .route('/all/mark/:email/:date/:label/:projectname')
//   .get(getEmployeeLabelSPerProject);

// router.route('/reset/:id').post(overtimeReset);

// router.route('/resetmany/:email/:resetValue').post(overtimeResetMany);

// router.route('/attendance/:email/:dateOffset').get(getEmployeeAttendance);

// router.route('/ghostworker/:email').get(getGhostEmployeeAttendance);

// router.route('/attendancesum/:email').get(SumOfAttendances);

// router.route('/subtractScore/:email/:id/:num/:score').get(SubScore);

// router.route('/addComplainScore/:email/:id/:num/:score').get(AddComplainScore);

// router.route('/add-score/:email/:id/:projectname/:nums').get(AddScore);

// router.route('/departCount/:email/:projectname').get(numberPerDepartment);

// router
//   .route('/complain-status/:id/:dueDate/:date/:label/:detail')
//   .get(ComplainStatus);

module.exports = router;
