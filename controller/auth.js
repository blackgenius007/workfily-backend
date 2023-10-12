const mongoose = require('mongoose');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateActivationCode = require('../utils/generateActivationCode.js');
const GenerateCode = require('../utils/generateCode.js');
const shortid = require('shortid');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
 
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc  Register new user
// @route   POST /api/users
// @access  Public

const register = asyncHandler(async (req, res) => {
  const {
    userName,
    email,
    businessName,
    businessSector,
    ownerId,
    ownerEmail,
    role,
    password,
  } = req.body;

console.log(req.body);

  if (!ownerId) {
    // Owner's registration
    const activationCode = shortid.generate();

    // Set activation code expiration to 30 days from now
    const activationCodeExpiration = new Date();
    activationCodeExpiration.setDate(activationCodeExpiration.getDate() + 30);

   
    const user = await User.create({
      email,
      ownerEmail: email,
      password,
      businessName,
      businessSector,
      activationCode,
      activationCodeExpiration,
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: user,
    });

    // Start the cron job to update activation codes for expired owners and associated users
cron.schedule('0 0 * * *', async () => {
  try {
    // Find owners whose activation codes have expired
    const expiredOwners = await User.find({
      ownerId: { $exists: false }, // Only select owners (not users)
      activationCodeExpiration: { $lt: new Date() },
    });

    // Iterate over expired owners and update their activation codes
    for (const owner of expiredOwners) {
      owner.activationCode = null;
      owner.activationCodeExpiration = null;
      await owner.save();

      // Find users associated with the expired owner and update their activation codes
      await User.updateMany(
        { ownerId: owner._id },
        { $set: { activationCode: null, activationCodeExpiration: null } }
      );
    }

    console.log('Activation codes updated for expired owners and associated users.');
  } catch (error) {
    console.error('Error updating activation codes:', error);
  }
});
  } else {
    // Convert ownerId string to ObjectId
    let ownerObjectId = null;
    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      ownerObjectId = new mongoose.Types.ObjectId(ownerId);
          }

    const user = await User.create({
      ownerId: ownerObjectId,
      ownerEmail,
      email,
      role,
      userName,
      password,
      isOwner: false,
      businessName,
      businessSector,
      // Add other fields for the user
    });

    const token = user.getSignedJwtToken();

    // res.status(200).json({
    //   success: true,
    //   token,
    //   data: user,
    // });
  }
});


// const register = asyncHandler(async (req, res) => {
//   const {
//     email,
//     businessName,
//     businessSector,
//     ownerId,
//     ownerEmail,
//     role,
//     password,
//   } = req.body;

//   if (!ownerId) {
//     // owner's registration
//     const user = await User.create({
//       email,
//       password,
//       businessName,
//       businessSector,
//     });

//     const token = user.getSignedJwtToken();

//     res.status(200).json({
//       success: true,
//       token,
//       data: user,
//     });
//   } else {
//     // Convert ownerId string to ObjectId
//     let ownerObjectId = null;
//     if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
//       ownerObjectId = new mongoose.Types.ObjectId(ownerId);
//     }

//     // user registration

//     const user = await User.create({
//       ownerId: ownerObjectId,
//       ownerEmail,
//       email,
//       role,
//       password,
//       isOwner: false,
//       businessName,
//       businessSector,
//       // Add other fields for the user
//     });

//     const token = user.getSignedJwtToken();

//     res.status(200).json({
//       success: true,
//       token,
//       data: user,
//     });
//   }
// });

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  // Check if password matches
  const isMtached = await user.matchPassword(password);
  if (!isMtached) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  // Create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
    data: user,
  });
});

// Get token from model create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = user.getSignedJwtToken();

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // Set secure flag for HTTPS only in production
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  // Send the token as a cookie
  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    data: user,
  });
};

// @desc  Forget password
// @route  POST /api/v1/auth/forgotPassword
// @access  Public

const fogotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  // console.log(resetToken);
  await user.save({
    validateBeforeSave: false,
  });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/authV2/resetpassword/${resetToken}`;
  const message = `Please click the following link to reset your password: \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc  reset password
// @route  PUT /api/v1/authv2/resetPassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hash token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('invalid token', 400));
  }

  //set new password
  (user.password = req.body.password),
    (user.resetPasswordToken = undefined),
    (user.resetPasswordExpire = undefined),
    await user.save();
  sendTokenResponse(user, 200, res);
});

const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc  get user list
// @route  PUT /api/v1/auth/users
// @access  Public

const getUserList = asyncHandler(async (req, res, next) => {
  // res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const {
    ownerId
  } = req.params;

  try {
    const userList = await User.find({
      ownerId,
      role: { $ne: 'owner' }
    });

    res.json(userList);
  } catch (error) {
    res.status(500).send(error);
  }
});

// @desc Get all inventory
//@routes Get/api/v1/inventory
//@acess  Public

const addDepartment = asyncHandler(async (req, res, next) => {
  const urls = Object.assign({}, req.body);
  const email = req.params.email;
  console.log(email);
  const { department } = urls;
  console.log(department);
  console.log(urls);

  if (urls) {
    console.log('url exists');
    try {
      let departmentArray = department;
      if (!Array.isArray(department)) {
        // Convert single department object to an array
        departmentArray = [department];
      }
      
      const results = await User.findOneAndUpdate(
        { email },
        { $push: { departmentAdded: { $each: departmentArray } } },
        {
          new: true,
          fields: {
            departmentAdded: 1,
          },
        }
      ).exec();
      res.json(results);
      console.log('Submitted successfully!');
    } catch (err) {
      throw err;
    }
  }
});



// const addDepartment = asyncHandler(async (req, res, next) => {
//   const urls = Object.assign({}, req.body);
//   const email = req.params.email;
//   console.log(email);
//   const { department } = urls;
//   console.log(department);
//   console.log(urls);

//   if (urls) {
//     console.log('url exists');
//     try {
//       const results = await User.findOneAndUpdate(
//         { email },
//         { $push: { departmentAdded: { $each: department } } },
//         {
//           new: true,
//           fields: {
//             departmentAdded: 1,
//           },
//         }
//       ).exec();
//       res.json(results);
//       console.log('Submitted successfully!');
//     } catch (err) {
//       throw err;
//     }
//   }
// });



module.exports = {
  register,
  login,
  fogotPassword,
  resetPassword,
  updateDetails,
  getUserList,
  addDepartment
};
