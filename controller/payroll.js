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
const referalCodes = require('referral-codes');
var cron = require('node-cron');
const moment = require('moment');
const Resume = require('../models/ResumeDetail');
const ShortList = require('../models/Shortlisted');
const toId = mongoose.Types.ObjectId;




// @desc    Create pool
//@routes   /api/v1/pool/
//@acess    Private
exports.createPayroll = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const { designation, medical, perhrIncome, grossIncome, _id, ownerId } = req.body;
  
    try {
      let user;
      let ownerObjectId = null;
  
      if (designation !== undefined && medical !== undefined && perhrIncome !== undefined && grossIncome !== undefined && _id !== undefined) {
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
      } else if (designation !== undefined && medical !== undefined && perhrIncome !== undefined && grossIncome !== undefined && ownerId !== undefined) {
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
  