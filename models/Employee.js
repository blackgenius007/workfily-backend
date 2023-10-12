const mongoose = require('mongoose');
const EmployeeSchema = new mongoose.Schema(
  {

    businessName: {
      type: String,
      required: false,
    },
    businessSector: {
      type: String,
      required: false,
    },
    employeeName:{
      type: String,
      required: false,
    },
      mobileNumber: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    employeeCode: {
      type: String,
      required: false,
    },
 
    employeeNumber: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    designation: {
      type: mongoose.Types.ObjectId,
      ref: 'Payroll',
    },
    department: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },
    sex: {
      type: String,
      required: false,
    },
    wages: {
      type: Number,
      required: false,
      default: 0,
    },

    projectName: {
      type: String,
      required: false,
    },

     accountNumber: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    nextOfKinName: {
      type: String,
      required: false,
    },
    nextOfKinRelationship: {
      type: String,
      required: false,
    },
    nextOfKinAddress: {
      type: String,
      required: false,
    },
    nextOfKinPhoneNumber: {
      type: String,
      required: false,
    },
    allowance: {
      type: Number,
      required: false,
      default: 0,
    },

    overtime: {
      type: Number,
      required: false,
      default: 0,
    },
    
    IOU: {
      type: Number,
      required: false,
      default: 0,
    },
    benefitInKind : {
      type: Number,
      required: false,
      default: 0,
    },
    loan : {
      type: Number,
      required: true,
      default: 0,
    },
    minimumRepay : {
      type: Number,
      required: false,
      default: 0,
    },

    repayDate : {
      type: Date,
      required: false,
      default: 0,
    },
    exemptDate : {
      type: Date,
      required: true,
      default: 0,
    },
    score: {
      type: Number,
      required: true,
      default: 1,
    },
    complainScore: {
      type: Number,
      required: false,
      default: 0,
    },
    joinDate: {
      type: String,
      required: false,
    },
    imagePath: {
      type: String,
      required: false,
    },
    public_id: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    paySchedule: {
      type: String,
      required: false,
      default:'monthly'
    },
    jobStatus: {
      type: String,
      required: false,
    },
    complainStatus: {
      type: String,
      required: false,
      default: 'good',
    },
    complainDetail: {
      type: String,
      required: false,
    },
    exemptionIsOn: {
      type: Boolean,
      required: false,
      default: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: String,
      required: true,
    },
    attendances: {},
  },
  { timestamps: true }
);

EmployeeSchema.statics.updateExemptStatus = async function () {
  const twentyDaysAgo = new Date();
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

  try {
    const result = await this.updateMany(
      { exempt: true, updatedAt: { $lt: twentyDaysAgo } },
      { $set: { exempt: false } }
    );

    console.log('Updated exempt status:', result);
  } catch (error) {
    console.error('Error updating exempt status:', error);
  }
};


const Employee = mongoose.model('Employee', EmployeeSchema, 'employee001');

module.exports = Employee;
