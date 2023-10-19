const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const cors =require('cors')
const colors = require('colors');
const cron = require('node-cron');
 

// Load env vars
dotenv.config({ path: `./config/config.env` });

// connect to database
connectDB();
// Schedule exemption to run every day at a specific time
cron.schedule('0 0 * * *', async () => {
  console.log('Running exempt status update job...');
  await Employee.updateExemptStatus();
});

const app = express();

app.use(cors(
  {
    origin:['https://filyapp.onrender.com']
  }
));

// cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route files
  const auth = require('./routes/auth');
const employee = require('./routes/employeeRoutes');
const images = require('./routes/imagesRoutes');
const errorHandler = require('./middleware/error');
const payroll = require('./routes/payrollRoutes');
const openAi = require('./routes/openAiRoutes');   

// //mount routers
 app.use('/api/v1/auth', auth);
app.use('/api/v1/employee', employee);
app.use('/api/v1/images', images);
app.use('/api/v1/designation', payroll);
app.use('/api/v1/openAi', openAi);
app.use(errorHandler);

// Serve frontend
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// app.use(errorHandler)

PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

 
