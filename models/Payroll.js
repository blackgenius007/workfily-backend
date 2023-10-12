const mongoose = require('mongoose');
//create Schema
const PayrollSchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },

    businessSector: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
     
    },
    
    medicalAllowance: {
      type: Number,
      required: false,
    },
 

    department: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
    },
   
    grossIncome: {
       type: Number,
       required: false
     },
     
     perhrIncome : {
       type: Number,
       required: false,
       default:0
     },
     ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: false,
     
    },
  },
  { timestamps: true }
);

// Create model from the schema
const Payroll = mongoose.model('Payroll', PayrollSchema);

// Export model
module.exports = Payroll;

