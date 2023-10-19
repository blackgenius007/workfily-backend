const path = require('path');
const ErrorResponse = require('../utils/errorResponse.js');
const asyncHandler = require('../middleware/async');
const Inmate = require('../models/Inmates');
const cloudinary = require('../routes/api/imagesRoute/utils/cloudinary');

// @desc get response from chat gpt
//@acess Private

exports.getResponse = asyncHandler(async (req, res, next) => {

    try {
        // Fetch data from MongoDB
        const data = await Data.find({});
        
        // Construct a prompt for GPT-3
        const prompt = `Given the data: ${JSON.stringify(data)}, what insights can you provide?`;
    
        // Send prompt to GPT-3
        const response = await openai.Completion.create({
          engine: 'davinci',  // Choose an engine suitable for your use case
          prompt: prompt,
          max_tokens: 100,     // Adjust as needed
          stop: null           // Optional stopping criteria
        });
    
        res.json({ response: response.choices[0].text.trim() });
      } catch (error) {
        console.error('GPT-3 error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }


})


// @desc get response from chat gpt
//@acess Private

exports.askFillybee = asyncHandler(async (req, res, next) => {

    try {
        const { question } = req.body;
    
        // Assuming you have MongoDB integration already set up
        const userCompanyData = await CompanyData.findOne({ user: req.user.id });
    
        // Construct a relevant prompt
        const prompt = `Given the company data: ${JSON.stringify(userCompanyData)}, ${question}`;
    
        // Use OpenAI to generate insights
        const response = await openai.complete(prompt);
    
        res.json({ insights: response.choices[0].text });
      } catch (error) {
        console.error('Error processing question:', error);
        res.status(500).json({ message: 'Internal server error' });
      }

})






