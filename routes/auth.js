const express = require('express');
const router = express.Router()
const multer = require('multer');
const upload = multer();

const {
  register,
  login,
  fogotPassword,
  resetPassword,
  updateDetails,
  getUserList,
  addDepartment
} = require('../controller/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users/:ownerId', getUserList);
router.put('/updatedetails', updateDetails);
router.post('/forgotpassword', fogotPassword);
router.route('/department/:email').post(upload.none(), addDepartment)
router.put('/resetpassword/:resettoken',  resetPassword);





module.exports = router;



