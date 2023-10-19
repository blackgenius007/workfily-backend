const path = require('path');
const ErrorResponse = require('../utils/errorResponse.js');
const asyncHandler = require('../middleware/async');
const Inmate = require('../models/Inmates');
const cloudinary = require('../routes/api/imagesRoute/utils/cloudinary');

// @desc Employee Photos
//@acess Private
exports.createInmatePhoto = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;

  console.log('inmate detail=>', _id);

  //check for existing image
  Inmate.findOne({ _id }, function (err, id) {
    // console.log('image-Id=>', id);

    if (err) {
      console.log(err);
      //lf there is an existing image delete from cloudinary
    } else if (id.public_id) {
      const { public_id } = id;
      cloudinary.v2.uploader.destroy(
        public_id && public_id,
        { type: 'upload', resource_type: 'image' },
        function (error, result) {
          if (error) {
            console.log('err', error);
          } else {
            // res.send(result)
            console.log('Asset deleted from cloudinary');
          }
        }
      );
      //upload assets  after destroying asset in cloudinary
      cloudinary.uploader.upload(req.file.path, (result) => {
        console.log(result);
        if (!result) {
          return res.status(500).send('Error No File Selected');
        } else {
          // If Success
          const { secure_url, public_id, original_filename } = result;
          Inmate.findOneAndUpdate(
            {
              _id: _id,
            
            },
            { $set: { imagePath: secure_url, public_id: public_id } },
            {
              new: true,
              fields: {
                imagePath: 1,
              },
            }
          ).exec((err, results) => {
            if (err) throw err;
            res.json(results);
            console.log('uploaded successfully');
          });
        }
      });
    } else {
      //upload process if asset doesn't exist in database
      cloudinary.uploader.upload(req.file.path, (result) => {
        console.log(result);
        if (!result) {
          return res.status(500).send('Error No File Selected');
        } else {
          // If Success
          const { secure_url, public_id, original_filename } = result;
        Inmate.findOneAndUpdate(
            {
              _id: _id,
          
            },
            { $set: { imagePath: secure_url, public_id: public_id } },
            {
              new: true,
              fields: {
                imagePath: 1,
              },
            }
          ).exec((err, results) => {
            if (err) throw err;
            res.json(results);
            console.log('Asset updated successfully');
          });
        }
      });
    }
  });
});




















// const path = require('path');
// const ErrorResponse = require('../utils/errorResponse.js');
// const asyncHandler = require('../middleware/async');
// const User = require('../models/User');
// const Inmate = require('../models/Inmates');
// const cloudinary = require('../utils/cloudinary.js');



// exports.InmatePhotos = asyncHandler(async (req, res, next) => {
//   // const _id = 
//   // console.log('Inmate details=>', _id);

//   try {
//     // Check for existing image
//     const inmate = await Inmate.findOne({ _id:'647f1011be551bfdcd5f0cee' });

//     if (!inmate) {
//       return res.status(404).json({
//         success: false,
//         error: 'Inmate not found',
//       });
//     }

//     // If an image exists, delete it from cloudinary
//     if (inmate.public_id) {
//       const { public_id } = inmate;
//       await cloudinary.v2.uploader.destroy(public_id, {
//         type: 'upload',
//         resource_type: 'image',
//       });
//       console.log('Asset deleted from cloudinary');
//     }

//     // Upload new asset to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     if (!result) {
//       return res.status(500).send('Error: No file selected');
//     }

//     const { secure_url, public_id } = result;

//     // Update inmate record with new image details
//     const updatedInmate = await Inmate.findByIdAndUpdate(
//       _id,
//       { $set: { imagePath: secure_url, public_id: public_id } },
//       { new: true, fields: { imagePath: 1 } }
//     );

//     res.json(updatedInmate);
//     console.log('Asset updated successfully');
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       error: 'Server error',
//     });
//   }
// });








// const path = require('path');
// const ErrorResponse = require('../utils/errorResponse.js');
// const asyncHandler = require('../middleware/async');
// const User = require('../models/User');
// const Inmate = require('../models/Inmates');
// const cloudinary = require('../utils/cloudinary.js');



// // @desc Inmate Photos
// //@acess Private
// exports.InmatePhotos = asyncHandler(async (req, res, next) => {
//     const _id = req.params.id;
//     console.log('Inmate details=>', _id);
  
//     //check for existing image
//   Inmate.findOne({ _id }, function (err, id) {
//       // console.log('image-Id=>', id);
  
//       if (err) {
//         console.log(err);
//         //lf there is an existing image delete from cloudinary
//       } else if (id.public_id) {
//         const { public_id } = id;
//         cloudinary.v2.uploader.destroy(
//           public_id && public_id,
//           { type: 'upload', resource_type: 'image' },
//           function (error, result) {
//             if (error) {
//               console.log('err', error);
//             } else {
//               // res.send(result)
//               console.log('Asset deleted from cloudinary');
//             }
//           }
//         );
//         //upload assets  after destroying asset in cloudinary
//         cloudinary.uploader.upload(req.file.path, (result) => {
//           console.log(result);
//           if (!result) {
//             return res.status(500).send('Error No File Selected');
//           } else {
//             // If Success
//             const { secure_url, public_id, original_filename } = result;
//             Inmate.findOneAndUpdate(
//               { 
//                 _id: _id,
//                 },
//               { $set: { imagePath: secure_url, public_id: public_id } },
//               {
//                 new: true,
//                 fields: {
//                   imagePath: 1,
//                 },
//               }
//             ).exec((err, results) => {
//               if (err) throw err;
//               res.json(results);
//               console.log('uploaded successfully');
//             });
//           }
//         });
//       } else {
//         //upload process if asset doesn't exist in database
//         cloudinary.uploader.upload(req.file.path, (result) => {
//           console.log(result);
//           if (!result) {
//             return res.status(500).send('Error No File Selected');
//           } else {
//             // If Success
//             const { secure_url, public_id, original_filename } = result;
//            Inmate.findOneAndUpdate(
//               {
//                 _id: _id,
             
//               },
//               { $set: { imagePath: secure_url, public_id: public_id } },
//               {
//                 new: true,
//                 fields: {
//                   imagePath: 1,
//                 },
//               }
//             ).exec((err, results) => {
//               if (err) throw err;
//               res.json(results);
//               console.log('Asset updated successfully');
//             });
//           }
//         });
//       }
//     });
//   });
  