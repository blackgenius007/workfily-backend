const path = require('path');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse.js');
const listDatesForThePastDays = require('../utils/pastDaysPicker.js');
const GenerateCode = require('../utils/generateCode.js');
const asyncHandler = require('../middleware/async');
const Employee = require('../models/Employee.js');
const User = require('../models/User');
const Payroll = require('../models/Payroll.js');
const Score = require('../models/scoreCard');
 
var cron = require('node-cron');
const moment = require('moment');
const Resume = require('../models/ResumeDetail');
const ShortList = require('../models/Shortlisted');
const toId = mongoose.Types.ObjectId;

// @desc    Create new employee with logged in id
//@routes   /api/v1/employee/create/:id
//@acess    Private

exports.createNewEmployee = asyncHandler(async (req, res, next) => {
  try {
    const {
      designation,
      department,
      sex,
      projectName,
      dateOfBirth,
      employeeName,
      mobileNumber,
      email,
      ownerEmail,
      address,
      bankName,
      accountNumber,
      nextOfKinName,
      nextOfKinRelationship,
      nextOfKinAddress,
      nextOfKinPhoneNumber,
    } = req.body;

    console.log(req.body);
    var _id = req.params.id;

    let designation_id = new mongoose.Types.ObjectId(designation);

    console.log('request from front =>', req.body.designation, designation_id);
    const pool = await User.findOne({ _id: _id });
    console.log('pool content=>', pool);

    const income = await Payroll.findOne({ _id: designation });
    console.log(income.grossIncome);

    const d = new Date();
    let year = d.getFullYear();
    const { businessName } = pool;
    const ItemCoded = `${businessName.slice(0, 3)}-${year
      .toString()
      .slice(-2)}-${GenerateCode(3)}`;

    const employee = new Employee({
      name: pool.name,
      email: pool.email,
      ownerEmail,
      department,
      wages: income.grossIncome,
      designation,
      sex,
      dateOfBirth,
      employeeName,
      mobileNumber,
      email,
      address,
      bankName,
      accountNumber,
      nextOfKinName,
      nextOfKinRelationship,
      nextOfKinAddress,
      nextOfKinPhoneNumber,
      joinDate: req.body.joinDate,
      projectName: projectName,
      employeeCode: ItemCoded,
      isActive: 'Active',
      attendances: {},
    });

    console.log(`pool before save ${employee}`);
    const savedEmployee = await employee.save();
    console.log('add pool success');
    res.send(savedEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// @desc Get all Employee by email
//@routes Get/api/v1/employee
//@acess  Public
exports.getAllEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    console.log('employee email from front+>', userEmail);

    const employees = await Employee.find(
      { $or: [{ email: userEmail }, { ownerEmail: userEmail }] },
      null,
      { sort: { name: 1 } }
    ).populate({
      model: 'Payroll',
      path: 'designation',
    });

    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// @desc Get all Employee per poject by user email
//@routes Get/api/v1/employee
//@acess  Public
exports.getAllEmployeePerProjectR = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  console.log(email, projectName);
  Employee.find(
    { email: email, projectName: projectName },
    function (err, employees) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json(employees);
      }
    }
  );
});

// @desc Get all Employee by user email
//@routes Get/api/v1/employee
//@acess  Public
exports.getAllEmployeePerProject = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  console.log(email, projectName);
  Employee.find(
    { email: email, projectName: projectName },
    function (err, employees) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json(employees);
      }
    }
  ).populate({
    model: 'Payroll',
    path: 'department',
  });
});

// @desc Get all Employee by user email
//@routes Get/api/v1/employee
//@acess  Public
exports.getAllEmployeePerDepartment = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  const unit = req.params.unit;
  console.log(email, projectName, unit);
  Employee.find(
    { email: email, projectName: projectName, unit: unit },
    function (err, employees) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json(employees);
      }
    }
  ).populate({
    model: 'Payroll',
    path: 'department',
  });
});

// @desc update order status
//@acess Private
exports.archieve = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  Employee.findOneAndUpdate(
    { _id: id },
    {
      $set: { isActive: 'inActive' },
    }
  ).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('archieved successfully!');

      res.send(result);
    }
  });
});

// @desc update order status
//@acess Private
exports.department = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  Employee.findOneAndUpdate(
    { _id: id },
    {
      $set: { department: department },
    }
  ).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('department added successfully!');

      res.send(result);
    }
  });
});

// @desc Get Total Employee
//@routes Get/api/v1/employee/employeeTotal
//@acess  Public
exports.getTotalEmployee = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const _id = req.params.id;
  const projectName = req.params.projectname;

  const response = await Employee.find({
    email: email,
    projectName: projectName,
  });
  res.json({ count: response.length });
});

// @desc Get one employee by id
//@routes   Get/api/employee/1:id
//@acess    Private
exports.getOneEmployee = asyncHandler(async (req, res, next) => {
  var _id = req.params.id;
  // console.log('from getOneEmployee',_id)
  Employee.findOne({ _id: _id }, function (err, employee) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      res.json(employee);
    }
  });
});

// @desc Get one employee by id
//@routes   Get/api/employee/1:id
//@acess    Private
exports.getOneEmployeePerProject = asyncHandler(async (req, res, next) => {
  var _id = req.params.id;
  var projectName = req.params.projectname;
  console.log('from getOneEmployeePerProject', _id, projectName);
  Employee.findOne(
    { _id: _id, projectName: projectName },
    function (err, employee) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json(employee);
      }
    }
  ).populate({
    model: 'Payroll',
    path: 'department',
  });
});

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getPaySlip = asyncHandler(async (req, res, next) => {
  const payslip = await Employee.findById(req.params.id).populate({
    model: 'Payroll',
    path: 'department',
    select:
      'basicPay housingAllowance transportAllowance Entertainment leaveAllowance ',
  });

  if (!payslip) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: payslip,
  });
});

// @desc    Update pool
//@routes   Put/api/v1/inventory/:email
//@acess    Private

exports.updateEmployee = (req, res, next) => {
  // console.log("req.body", req.body);
  // inserting a new update in SupplierPool
  var _id = req.params.id;
  var projectName = req.params.projectname;
  console.log(`id from front===>${(_id, projectName)}`);
  var pool = {
    employeeName: req.body.employeeName,
    department: req.body.department,
    employeeNumber: req.body.employeeNumber,
    origin: req.body.origin,
    address: req.body.address,
    nextName: req.body.nextName,
    nextAddress: req.body.nextAddress,
    nextNumber: req.body.nextNumber,
    nextRelationship: req.body.nextRelationship,
    accountDetail: req.body.accountDetail,
    wages: req.body.wages,
  };

  Employee.findByIdAndUpdate(_id, pool, { new: true }, function (err, pool) {
    if (err) {
      console.log('err', err);
      res.status(500).send(err);
    } else {
      console.log('success');
      res.send(pool);
    }
  });
};

// @desc Get Employee Detail
//@routes Get/api/employee/detail/:id'
//@acess Public

exports.getEmployeeDetail = asyncHandler(async (req, res, next) => {
  try {
    const _id = req.params.id;

    console.log('Employ-detail=>', _id);

    const employee = await Employee.findOne({ _id: _id }).populate({
      model: 'Payroll',
      path: 'designation',
    });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    var data = {};
    var today = new Date();
    var currentMonth = moment(today).format('MMM');
    var currentYear = moment(today).format('YYYY');
    data.employee = employee;
    data.last30Days = {
      Present: 0,
      Sick: 0,
      Suspension: 0,
      Vacation: 0,
      Absent: 0,
    };
    data.last7Days = {
      Present: 0,
      Sick: 0,
      Suspension: 0,
      Vacation: 0,
      Absent: 0,
    };
    data.last365Days = {
      Present: 0,
      Sick: 0,
      Suspension: 0,
      Vacation: 0,
      Absent: 0,
    };

    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    data.last12Months = [];
    data.last12MonthsData = {
      Present: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Sick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Suspension: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Vacation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Absent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    var startingMonth = today.getMonth();
    var currMonth = startingMonth;
    for (var i = 0; i < 12; i++) {
      var temp = currMonth;
      if (temp < 0) temp += 12;
      data.last12Months.push(months[temp]);
      currMonth--;
    }
    data.last12Months.reverse();
    var count = 0;
    if (!employee.attendances) {
      // kalau employee belum ada record attendance, anggap semua absen
      data.last7Days.Absent = 7;
      data.last30Days.Absent = 30;
      data.last365Days.Absent = 365;
      data.last12MonthsData.Absent = [
        365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365,
      ];
    } else {
      // jika uda ada, maka kita perlu hitung satu satu
      while (count < 365) {
        var checkedDate = moment(today)
          .subtract(count, 'days')
          .format('YYYY-MM-DD');
        var checkedMonth = moment(checkedDate).format('MMM');
        var checkedMonthIndex = data.last12Months.indexOf(
          moment(checkedDate).format('MMM')
        );
        var checkedYear = moment(checkedDate).format('YYYY');

        if (!employee.attendances[checkedDate]) {
          // jika tidak ada, berarti absent
          if (count < 30) data.last30Days.Absent++;
          if (count < 7) data.last7Days.Absent++;
          data.last365Days.Absent++;

          if (currentMonth === checkedMonth) {
            if (currentYear === checkedYear) {
              data.last12MonthsData.Absent[checkedMonthIndex]++;
            }
          } else {
            data.last12MonthsData.Absent[checkedMonthIndex]++;
          }
        } else {
          // jika ada, cek apa itu
          var status = employee.attendances[checkedDate];
          if (count < 30) data.last30Days[status]++;
          if (count < 7) data.last7Days[status]++;
          data.last365Days[status]++;
          data.last12MonthsData[status][checkedMonthIndex]++;
        }
        count++;
      }
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred!', error: err.message });
  }
});

// @desc Get Employee date/
//@routes Get/api/employee/mark/:id/:date/:label
//@acess Public
// exports.getEmployeeLabel = asyncHandler(async (req, res, next) => {
//   var _id = req.params.id;
//   var date = req.params.date;
//   var label = req.params.label;

//   var employee = {};
//   var updatedField = 'attendances.' + date;
//   employee[updatedField] = label;

//   Employee.findByIdAndUpdate(
//     _id,
//     { $set: employee },
//     { new: true },
//     function (err, employee) {
//       if (err) {
//         res.status(500);
//         res.send(err);
//       } else {
//         res.status(200);
//         res.send(employee);
//       }
//     }
//   );
// });

// @desc Get Employee date
//@routes Get/api/employee/mark/:id/:date/:label
//@acess Public
exports.getOneEmployeeLabel = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const _id = req.params.employeeId;
  const date = req.params.date;
  const label = req.params.label;

  const updatedField = 'attendances.' + date;
  const updateObject = { [updatedField]: label };

  try {
    // Update the employee with the latest label for the given date
    const updatedEmployee = await Employee.findByIdAndUpdate(
      _id,
      { $set: updateObject },
      { new: true }
    );

    res.status(200).send(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @desc Get Employee date
//@routes   Get/api/employee/mark/:date/:label'
//@acess    Public
// exports.getEmployeeLabelS = asyncHandler(async (req, res, next) => {
//   const email = req.params.email;

//   var date = req.params.date;
//   var label = req.params.label;
//   if (label == 'Absent') label = false;
//   var employee = {};
//   var updatedField = 'attendances.' + date;
//   employee[updatedField] = label;

//   Employee.findOneAndUpdate(
//     { email: email },
//     { $set: employee },
//     { multi: true },
//     function (err, employees) {
//       if (err) {
//         res.status(500);
//         res.send(err);
//       } else {
//         res.status(200);
//         res.send();
//       }
//     }
//   );
// });
// @desc Get Employee date
//@routes   Get/api/employee/mark/:date/:label'
//@acess    Public

exports.getEmployeeLabelS = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const email = req.params.email;
  const date = req.params.date;
  let label = req.params.label;

  if (label === 'Absent') {
    label = 'Absent';
  }

  const updatedField = 'attendances.' + date;
  const updateObject = { [updatedField]: label };

  try {
    const updatedEmployees = await Employee.updateMany(
      {
        $or: [{ email: email }, { ownerEmail: email }],
        complainStatus: 'good',
      },
      { $set: updateObject }
    );

    console.log('Labels updated successfully');
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @desc Get Employee date
//@routes   Get/api/employee/mark/:date/:label'
//@acess    Public
exports.ComplainStatus = asyncHandler(async (req, res, next) => {
  //2022-09-03T15:31
  var _id = req.params.id;
  var complainDetail = req.params.complainDetail;
  var date = req.params.date;
  var dueDate = req.params.dueDate;
  var label = req.params.label;
  var detail = req.params.detail;

  console.log(complainDetail, date, label);
  var employee = {};
  var updatedField = 'attendances.' + date;
  employee[updatedField] = label;

  Employee.findByIdAndUpdate(
    _id,
    {
      $set: employee,
      complainStatus: 'Suspension',
      endDate: dueDate,
      complainDetail: detail,
    },
    { new: true },
    function (err, employee) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.status(200);
        res.send(employee);
      }
    }
  );
});

// @desc Get Employee date
//@routes   Get/api/employee/mark/:date/:label'
//@acess    Public
exports.reviewComplain = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  console.log('update=>', date);
  console.log('Complain-status-here');

  try {
    const result = await Employee.updateMany(
      { endDate: new Date(date) },
      { $set: { complainStatus: 'good' } }
    );

    console.log('due date updated successfully...');
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// @desc Delete Employee
//@routes Get'/api/employee/delete/:id'
//@acess Private
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  employee = Employee.findById(req.params.id)
    .then((employee) => employee.remove())
    .then(() => res.json({ deleted: true, employee }))
    .catch((err) => res.json(err));
});

// @desc Reset Employee overtime
//@routes Get'/api/employee/resetovertime/:id'
//@acess Private
exports.overtimeReset = asyncHandler(async (req, res, next) => {
  var _id = req.params.id;
  Employee.findOneAndUpdate(
    { _id: _id },
    { $unset: { overtime: null } },
    (err, data) => {
      res.status(200).json({ data });
      res.status(400).json({ success: false });
    }
  );
});

// @desc Reset overtime for All Employee
//@routes Get'/api/employee/resetallovertime/:id'
//@acess Private
exports.overtimeResetMany = asyncHandler(async (req, res, next) => {
  Employee.updateMany({}, { overtime: null }, (err, data) => {
    if (err) {
      res.status(400).json({ success: false });
      return;
    }
    res.status(200).json({ data });
  });
});

// @desc Get All Employee Attendance in the last 7 days
//@routes Get'/api/employee/attendance'
//@acess Private

exports.getEmployeeAttendance = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const dateOffset = parseInt(req.params.dateOffset);

  console.log('from front =>', email);

  try {
    const results = await Employee.aggregate([
      {
        $match: {
          $or: [{ email: email }, { ownerEmail: email }],
          attendances: { $exists: true },
        },
      },
      {
        $addFields: {
          numberofPresentAttendances: {
            $size: {
              $filter: {
                input: { $objectToArray: '$attendances' },
                cond: {
                  $and: [
                    {
                      $in: ['$$this.k', listDatesForThePastDays(dateOffset)],
                    },
                    { $eq: ['$$this.v', 'Present'] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'payrolls', // collection name is 'payrolls'
          localField: 'designation',
          foreignField: '_id',
          as: 'designation',
        },
      },
      {
        $unwind: '$designation',
      },
    ]);

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// exports.getEmployeeAttendance = asyncHandler(async (req, res, next) => {
//   const email = req.params.email;
//   const dateOffset = parseInt(req.params.dateOffset);

//   console.log('from front =>', email); // Fix the variable name here

//   try {
//     const results = await Employee.aggregate([
//       {
//         $match: {
//           $or: [{ email: email }, { ownerEmail: email }], // Match either email or ownerEmail
//           attendances: { $exists: true },
//         },
//       },
//       {
//         $addFields: {
//           numberofPresentAttendances: {
//             $size: {
//               $filter: {
//                 input: { $objectToArray: '$attendances' },
//                 cond: {
//                   $and: [
//                     {
//                       $in: ['$$this.k', listDatesForThePastDays(dateOffset)],
//                     },
//                     { $eq: ['$$this.v', 'Present'] },
//                   ],
//                 },
//               },
//             },
//           },
//         },
//       },
//     ]);
//     res.json(results);
//   } catch (err) {
//     next(err);
//   }
// });

exports.getEmployeeRedundancy = asyncHandler(async (req, res, next) => {
  const email = req.params.email;

  console.log(email);
  try {
    const results = await Employee.aggregate([
      { $match: { email: email } },
      {
        $match: { attendances: { $exists: true } },
      },
      {
        $addFields: {
          numberofPresentAttendances: {
            $size: {
              $filter: {
                input: { $objectToArray: '$attendances' },
                cond: {
                  $and: [
                    { $in: ['$$this.k', listDatesForThePastDays(7)] },
                    { $eq: ['$$this.v', 'Present'] },
                  ],
                },
              },
            },
          },
        },
      },
    ]);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// @desc Get All Employee Attendance in the last 7 days
//@routes Get'/api/employee/attendance'
//@acess Private
exports.getEmployeeRedundancy = asyncHandler(async (req, res, next) => {
  const email = req.params.email;

  console.log(email);
  Employee.aggregate([
    { $match: { email: email } },
    {
      $match: { attendances: { $exists: true } },
    },
    {
      $addFields: {
        numberofPresentAttendances: {
          $size: {
            $filter: {
              input: { $objectToArray: '$attendances' },
              cond: {
                $and: [
                  { $in: ['$$this.k', listDatesForThePastDays(7)] },
                  { $eq: ['$$this.v', 'Present'] },
                ],
              },
            },
          },
        },
      },
    },
  ]).exec((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc Get All Employee Attendance in the last 7 days
//@routes Get'/api/employee/attendance'
//@acess Private
exports.getEmployeeRedundancyPerProject = asyncHandler(
  async (req, res, next) => {
    const email = req.params.email;
    const projectName = req.params.projectname;
    console.log(email, projectName);
    Employee.aggregate([
      { $match: { email: email, projectName: projectName } },
      {
        $match: { attendances: { $exists: true } },
      },
      {
        $addFields: {
          numberofPresentAttendances: {
            $size: {
              $filter: {
                input: { $objectToArray: '$attendances' },
                cond: {
                  $and: [
                    { $in: ['$$this.k', listDatesForThePastDays(2)] },
                    { $eq: ['$$this.v', 'Present'] },
                  ],
                },
              },
            },
          },
        },
      },
    ]).exec((err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
);

// @desc Get All Employee Attendance in the last 7 days
//@routes Get'/api/employee/attendance'
//@acess Private
exports.getEmployeeGhostPerProject = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  console.log(email, projectName);
  Employee.aggregate([
    { $match: { email: email, projectName: projectName } },
    {
      $match: { attendances: { $exists: true } },
    },
    {
      $addFields: {
        numberofPresentAttendances: {
          $size: {
            $filter: {
              input: { $objectToArray: '$attendances' },
              cond: {
                $and: [
                  { $in: ['$$this.k', listDatesForThePastDays(90)] },
                  { $eq: ['$$this.v', 'Present'] },
                ],
              },
            },
          },
        },
      },
    },
  ]).exec((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc Get All Employee Attendance in the last 7 days
//@routes Get'/api/employee/attendance'
//@acess Private
exports.getEmployeeAttendancePerProject = asyncHandler(
  async (req, res, next) => {
    const { userEmail, dateOffset } = req.params;
    console.log('fromfront=>', email);
    const dateOffsets = parseInt(dateOffset);

    console.log(userEmail);
    console.log(dateOffset);
    Employee.aggregate([
      { $match: { email: email } },

      {
        $match: { attendances: { $exists: true } },
      },

      {
        $addFields: {
          numberofPresentAttendances: {
            $size: {
              $filter: {
                input: { $objectToArray: '$attendances' },
                cond: {
                  $and: [
                    { $in: ['$$this.k', listDatesForThePastDays(dateOffsets)] },
                    { $eq: ['$$this.v', 'Present'] },
                  ],
                },
              },
            },
          },
        },
      },
    ]).exec((err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
);

// @desc Get All Employee Attendance in the last 1 days
//@routes Get'/api/employee/attendance'
//@acess Private
exports.getEmployeeAttendancePreviousDay = asyncHandler(
  async (req, res, next) => {
    const email = req.params.email;
    const projectName = req.params.projectname;
    const dateOffset = req.params.dateOffset;
    const date = moment().toString();
    console.log(email);
    Employee.aggregate([
      { $match: { email: email, projectName: projectName } },

      {
        $match: { attendances: { $exists: true } },
      },
      {
        $addFields: {
          numberofPresentAttendances: {
            $size: {
              $filter: {
                input: { $objectToArray: '$attendances' },
                cond: {
                  $and: [
                    { $in: ['$$this.k', listDatesForThePastDays(dateOffset)] },
                    { $eq: ['$$this.v', 'Present'] },
                  ],
                },
              },
            },
          },
        },
      },

      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: null,
          counts: {
            $push: {
              department: '$_id',
              number: '$count',
            },
          },
        },
      },
    ]).exec((err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
);

// @desc Get All Employee Attendance in the last 90 days
//@routes Get'/api/employee/ghostworker'
//@acess Private
exports.getGhostEmployeeAttendance = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  Employee.aggregate([
    { $match: { email: email } },
    {
      $match: { attendances: { $exists: true } },
    },
    {
      $addFields: {
        numberofPresentAttendances: {
          $size: {
            $filter: {
              input: { $objectToArray: '$attendances' },
              cond: {
                $and: [
                  { $in: ['$$this.k', listDatesForThePastDays(90)] },
                  { $eq: ['$$this.v', 'Present'] },
                ],
              },
            },
          },
        },
      },
    },
  ]).exec((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc Get Sum of Employee Attendances
//@routes Get'/api/employee/sumattendance'
//@acess Public
exports.SumOfAttendances = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  Employee.aggregate([
    { $match: { email: email } },
    {
      $match: { attendances: { $exists: true } },
    },
    {
      $group: {
        _id: null,
        totalPresent: {
          $sum: {
            $size: {
              $filter: {
                input: { $objectToArray: '$attendances' },
                cond: {
                  $and: [
                    { $in: ['$$this.k', listDatesForThePastDays(7)] },
                    { $eq: ['$$this.v', 'Present'] },
                  ],
                },
              },
            },
          },
        },
      },
    },
  ]).exec((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc Addscore
//@routes   Get//:id/:num/:quantity
//@acess    Private
exports.AddScore = asyncHandler(async (req, res, next) => {
  var _id = req.params.id; //employee id
  var nums = req.params.nums;
  var email = req.params.email;
  var projectName = req.params.projectname; // projectname
  console.log(nums, projectName, _id, email);

  Employee.findOneAndUpdate(
    { _id: _id, projectName: projectName },
    {
      $set: { score: parseInt(nums) },
    }
  ).exec((err, results) => {
    if (err) throw err;
    res.json(results);
    console.log('update successful...');
  });
});

// @desc Subtract score
//@routes   Get//:id/:num/:quantity
//@acess    Private
exports.SubScore = asyncHandler(async (req, res, next) => {
  var id = req.params.id;
  var score = req.params.score;
  var email = req.params.email;
  const order = req.params.order;

  // console.log('id----', id);
  var num_mod = req.params.num;
  var modified_count = parseInt(num_mod) - parseInt(score);
  console.log('num_mod----', num_mod);
  Employee.findByIdAndUpdate(
    id,
    { score: parseInt(num_mod) },
    { new: true },
    function (err, scoreCard) {
      if (err) {
        console.log('err', err);
        res.status(500).send(err);
      } else {
        console.log(scoreCard.employeeName);

        const newScore = new Score({
          businessName: scoreCard.businessName,
          employeeName: scoreCard.employeeName,
          employeeMail: scoreCard.employeeMail,
          businessMobile: scoreCard.businessMobile,
          email: scoreCard.email,
          recommendation_score: parseInt(modified_count),
          email: req.params.email,
        });

        newScore.save(function (err, scoreCard) {
          if (err) {
            console.log(err);
          } else {
            console.log('add log success');
            res.send(scoreCard);
          }
        });
      }
    }
  );
});

// @desc Add Complain score
//@routes   Get//:id/:num/:quantity
//@acess    Private
exports.AddComplainScore = asyncHandler(async (req, res, next) => {
  var id = req.params.id;
  var complainScore = req.params.complainScore;
  console.log(complainScore);
  // console.log('id----', id);
  var num_mod = req.params.num;
  var modified_count = parseInt(complainScore) + parseInt(num_mod);
  console.log('num_mod----', num_mod);
  Employee.findByIdAndUpdate(
    id,
    { complainScore: parseInt(num_mod) },
    { new: true },
    function (err, scoreCard) {
      if (err) {
        console.log('err', err);
        res.status(500).send(err);
      } else {
        console.log(scoreCard.employeeName);

        const newScore = new Score({
          businessName: scoreCard.businessName,
          employeeName: scoreCard.employeeName,
          employeeMail: scoreCard.employeeMail,
          businessMobile: scoreCard.businessMobile,
          email: scoreCard.email,
          complainScore: parseInt(modified_count),
          email: req.params.email,
        });
        console.log(newScore);
        newScore.save(function (err, scoreCard) {
          if (err) {
            console.log(err);
          } else {
            console.log('add log success');
            res.send(scoreCard);
          }
        });
      }
    }
  );
});

// @desc Add Complain score
//@routes Get//:id/:num/:quantity
//@acess Private
exports.numberPerDepartment = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  Employee.aggregate([
    { $match: { email: email, projectName: projectName } },

    {
      $group: {
        _id: '$department',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: null,
        counts: {
          $push: {
            department: '$_id',
            number: '$count',
          },
        },
      },
    },
  ]).exec((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc Add Complain score
//@routes Get//:id/:num/:quantity
//@acess Private
exports.overtimeAdder = asyncHandler(async (req, res, next) => {
  console.log('overtime-==>');
  const _id = req.params.id;
  const overtime = req.params.value;
  console.log(overtime, _id);

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: _id },
      {
        $set: { overtime: overtime },
      }
    ).exec();

    if (updatedEmployee) {
      console.log('overtime update successful');
      res.send(updatedEmployee);
    } else {
      console.log('Employee not found');
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// @desc Add Complain score
//@routes Get//:id/:num/:quantity
//@acess Private
exports.IOU = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const IOU = req.params.value;

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: _id },
      {
        $set: { IOU: IOU },
      }
    ).exec();

    if (updatedEmployee) {
      console.log('IOU update successful');
      res.send(updatedEmployee);
    } else {
      console.log('Employee not found');
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// @desc Add Complain score
//@routes Get//:id/:num/:quantity
//@acess Private
exports.overtimeReset = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  const overtime = parseInt(req.params.overtime);
  console.log(email);
  Employee.updateMany(
    { email: email, projectName: projectName },
    { $set: { overtime: overtime } }
  ).exec((err, pool) => {
    if (err) {
      console.log(err);
    } else {
      console.log('overtime update successful');

      res.send(pool);
    }
  });
});

// @desc Add Complain score
//@routes Get//:id/:num/:quantity
//@acess Private
exports.allowanceAdder = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  const allowance = req.params.value;
  console.log('allowance:', allowance, _id);

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: _id },
      {
        $set: { allowance: allowance },
      }
    ).exec();

    if (updatedEmployee) {
      console.log('allowance update successful');
      res.send(updatedEmployee);
    } else {
      console.log('Employee not found');
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// @desc Add Complain score
//@routes Get//:id/:num/:quantity
//@acess Private
exports.allowanceReset = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const projectName = req.params.projectname;
  const overtime = parseInt(req.params.overtime);
  console.log(email);
  Employee.updateMany(
    { email: email, projectName: projectName },
    { $set: { allowance: allowance } }
  ).exec((err, pool) => {
    if (err) {
      console.log(err);
    } else {
      console.log('overtime update successful');

      res.send(pool);
    }
  });
});

// @desc    Create pool
//@routes   /api/v1/pool/
//@acess    Private
exports.createPayroll = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { designation, medical, perhrIncome, grossIncome, _id, ownerId } =
    req.body;

  try {
    let user;
    let ownerObjectId = null;

    if (
      designation !== undefined &&
      medical !== undefined &&
      perhrIncome !== undefined &&
      grossIncome !== undefined &&
      _id !== undefined
    ) {
      // If designation, medical, perhrIncome, grossIncome, and _id are present,
      // use _id as ownerId and fetch the user by _id
      user = await User.findOne({ _id });
      if (!user) {
        console.log('Employee not found...only _id');
        return res.status(404).send('Employee not found');
      }
      // Convert _id to ObjectId
      if (mongoose.Types.ObjectId.isValid(_id)) {
        ownerObjectId = new mongoose.Types.ObjectId(_id);
      }
    } else if (
      designation !== undefined &&
      medical !== undefined &&
      perhrIncome !== undefined &&
      grossIncome !== undefined &&
      ownerId !== undefined
    ) {
      // If designation, medical, perhrIncome, grossIncome, and ownerId are present,
      // use ownerId as _id and fetch the user by ownerId
      user = await User.findOne({ _id: ownerId });
      if (!user) {
        console.log('Employee not found...only ownerId');
        return res.status(404).send('Employee not found');
      }
      // Convert ownerId to ObjectId
      if (mongoose.Types.ObjectId.isValid(ownerId)) {
        ownerObjectId = new mongoose.Types.ObjectId(ownerId);
      }
    } else {
      return res.status(400).send('Invalid request payload');
    }

    const newPayroll = new Payroll({
      businessName: user.businessName,
      businessSector: user.businessSector,
      email: user.email,
      designation: designation,
      medicalAllowance: medical,
      grossIncome: grossIncome,
      perhrIncome: perhrIncome,
      ownerId: ownerObjectId,
    });

    await newPayroll.save();
    console.log('Payroll created:', newPayroll);
    res.status(201).send(newPayroll);
  } catch (error) {
    console.error('Error creating payroll:', error);
    res.status(500).send('An error occurred while creating the payroll');
  }
});

// @desc Get all Employee by user email
//@routes Get/api/v1/employee
//@acess  Public
exports.getAllDesignation = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  console.log(email);

  try {
    const payroll = await Payroll.find({ email: email }).exec();
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// @desc    Create shortlisted
//@routes   /api/v1/employee/create/:id
//@acess    Private
exports.shortlisted = asyncHandler(async (req, res, next) => {
  var shortlist_id = toId(req.params.id);
  var projectname = req.params.projectname;
  console.log(projectname, shortlist_id, req.params.id);
  const doc = await ShortList.create({
    projectname: projectname,
    jobseeker_id: shortlist_id,
  });
  res.status(201).json({
    data: doc,
  });

  console.log('create shortlist successful!');
});

// @desc    Create shortlisted
//@routes   /api/v1/employee/create/:id
//@acess    Private
exports.getShortlisted = asyncHandler(async (req, res, next) => {
  const projectName = req.params.projectname;
  console.log(projectName);
  ShortList.find(
    // { projectName: projectName},
    function (err, jobseeker) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json(jobseeker);
      }
    }
  ).populate({
    model: 'Resume',
    path: 'jobseeker_id',
  });
});

// @desc Get Total Employee
//@routes Get/api/v1/employee/employeeTotal
//@acess  Public
exports.getSupplierDetail = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;

  const response = await Employee.find({ _id: _id });
  res.json({ count: response.length });
});

// @desc update order status
//@acess Private
exports.addLoan = asyncHandler(async (req, res, next) => {
  const { loanAmount, minimumRepay, id, repayDate } = req.body;
  console.log(loanAmount, minimumRepay, id, repayDate);

  try {
    const result = await Employee.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          loan: loanAmount,
          minimumRepay: minimumRepay,
          repayDate: repayDate,
        },
      }
    ).exec();

    console.log('Loan detail added successfully!');
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while adding loan details.');
  }
});

// @desc update order status
//@acess Private
exports.updateLoan = asyncHandler(async (req, res, next) => {
  const { id, ExemptBy, repayDate } = req.body;
  console.log(req.body);

  try {
    const result = await Employee.findOneAndUpdate(
      { _id: id },
      {
        $set: { repayDate, exemptionIsOn:true },
      }
    ).exec();

    console.log('Loan detail added successfully!');
    res.send(result);
  } catch (err) {
    console.error(err);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: 'An error occurred' });
  }
});

// @desc update order status
//@acess Private
exports.LoanOff = asyncHandler(async (req, res, next) => {
  const { id, today } = req.body;
  console.log(req.body);

  try {
    const result = await Employee.findOneAndUpdate(
      { _id: id },
      {
        $set: { repayDate:today, exemptionIsOn:null },
      }
    ).exec();

    console.log('Loan detail added successfully!');
    res.send(result);
  } catch (err) {
    console.error(err);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: 'An error occurred' });
  }
});

