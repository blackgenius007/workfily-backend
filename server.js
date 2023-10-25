require('dotenv').config()
require('express-async-errors') 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions')
const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger')   
const cors =require('cors')
const cron = require('node-cron');
const colors = require('colors');
PORT = process.env.PORT || 5000 
console.log(process.env.NODE_ENV)
 

// connect to database
connectDB();

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors(corsOptions))

// Schedule exemption to run every day at a specific time
cron.schedule('0 0 * * *', async () => {
  console.log('Running exempt status update job...');
  await Employee.updateExemptStatus();
});

 
// Body parser
app.use(express.json());
   
// cookie parser
app.use(cookieParser());

// Serve frontend
app.use('/', express.static(path.join(__dirname, 'public')))

 

// Route files
  const auth = require('./routes/auth');
const employee = require('./routes/employeeRoutes');
const images = require('./routes/imagesRoutes');
const errorHandler = require('./middleware/error');
const payroll = require('./routes/payrollRoutes');
const openAi = require('./routes/openAiRoutes');   

 //mount routers
 app.use('/api/v1/auth', auth);
app.use('/api/v1/employee', employee);
app.use('/api/v1/images', images);
app.use('/api/v1/designation', payroll);
app.use('/api/v1/openAi', openAi);
app.use(errorHandler);

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})
 
app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB'.cyan.underline.bold)
  app.listen(PORT, () => console.log(`Server running on port ${PORT}` .yellow.bold))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


 

 
