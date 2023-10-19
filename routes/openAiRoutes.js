const express = require('express');
const router = express.Router()
const openai = require('openai');

const {
getResponse

} = require('../controller/openAi');

router.post('/get_gpt_response', getResponse);


module.exports = router;



