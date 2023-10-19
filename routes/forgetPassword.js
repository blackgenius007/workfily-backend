const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const {
  createNewInmate,
  getAllInmate,
  getOneInmate,
  updateInmate,
  deleteInmate,
} = require('../controller/employee');

router.route('/create/:id').post(createNewInmate);
router.route('/inmates').get(getAllInmate);
router.route('/detail/:num').get(getOneInmate);
router.route('/update/:num/').post(updateInmate);
router.route('/delete/:num').delete(deleteInmate);

module.exports = router;
