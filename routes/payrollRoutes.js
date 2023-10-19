const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {createPayroll} = require('../controller/employee');

router.route('/payroll').post(createPayroll);  

module.exports = router;