const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const InmateSchema = new mongoose.Schema(

  {
    inmate_name: {
      type: String,
      required: true,
    },
Penitentiary: {
      type: String,
      required: false,
    },
    inmate_number: {
      type: String,
      required: false,
    },
       offence_category: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
     reg_officer: {
      type: String,
      required: false,
    },
   id_number: {
      type: String,
      required: false,
    },
    date_of_birth: {
      type: String,
      required: false,
    },
    ethnicity: {
      type: String,
      required: false,
    },
    social_security: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    eye_color: {
      type: String,
      required: false,
    },
    hair_color: {
      type: String,
      required: false,
    },
    scar: {
      type: String,
      required: false,
    },
    medical_condition: {
      type: String,
      required: false,
    },
    disability: {
      type: String,
      required: false,
    },
    id_number: {
      type: String,
      required: false,
    },
    bookingDate: {
      type: String,
      required: false,
    },
    booking_officer: {
      type: String,
      required: false,
    },
    arrest_officer: {
      type: String,
      required: false,
    },
    booking_time: {
      type: String,
      required: false,
    },
    arrest_location: {
      type: String,
      required: false,
    },
    arrest_time: {
      type: String,
      required: false,
    },
    arrestDate: {
      type: String,
      required: false,
    },
    verdict: {
      type: String,
      required: false,
    },
    sentencing_court: {
      type: String,
      required: false,
    },
    belongings: {
      type: String,
      required: false,
    },
    ImagePath: {
      type: String,
      required: false,
    },
    public_id: {
      type: String,
      required: false,
    },
    fingerprint: {
      type: String,
      required: false,
    },
    endDate: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const Inmate = mongoose.model('inmates', InmateSchema, 'inmates');

module.exports = Inmate;
