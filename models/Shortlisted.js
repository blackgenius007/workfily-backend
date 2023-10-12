const mongoose= require('mongoose');


//create Schema
const ShortlistSchema = new mongoose.Schema({
    jobseeker_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Resume',
      },
 
  projectname:{
      type:String,
      required:false
  },
  createdAt:{
      type:Date,
      default: Date.now
  },

});



// Create model from the schema
const ShortList = mongoose.model("ShortList", ShortlistSchema,"ShortListed");


// Export model
module.exports = ShortList;