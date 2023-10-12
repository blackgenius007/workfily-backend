const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: false,
  },
  businessSector: {
    type: String,
    required: true,
  },
  businessLocation: {
    type: String,
    required: true,
  },
  businessMobile: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  jobseeker: {
    type: mongoose.Types.ObjectId,
    ref: 'Shortlist',
  },

  designation: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  birthday : {
    type: Date,
    required: true,
  },
  jobStatus: {
    type: String,
    required: true,
  },

  experience: {
    type: String,
    required: true,
  },
  jobDescribe: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    required: true,
    default: 0,
  },
  imagePath: {
    type: String,
    required: false,
  },
  public_id: {
    type: String,
    required: false,
  },
  videoPath: {
    type: String,
    required: false,
  },
  docsPath: [ String ],

  urlPath: [
    {
      type: String,
      required: false,
    },
  ],
  portfolio: [
    {
      type: String,
      required: false,
    },
  ],

visitors: [
  {
    type: String,
    required: false,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Resume = mongoose.model('Resume', ResumeSchema, 'resume');

module.exports = Resume;
