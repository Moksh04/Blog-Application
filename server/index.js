const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config.env' });

const userRouter = require('./routes/UserRoutes');
const postRouter = require('./routes/PostRoutes');

const app = express();

// we need to specify options in the cors middleware in order to allow the browser to send cookies in request headers
const corsOptions = {
  origin: 'https://blog-application-fe.vercel.app', // allowing requests from this endpoint to send cookies in requests
  methods: ['POST', 'GET', 'PATCH', 'DELETE'],
  credentials: true,
};

app.options('*', cors(corsOptions)); // Handle preflight requests
// Custom middleware to set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://blog-application-fe.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(`${__dirname}/uploads`));

const PORT = process.env.PORT || '5000';

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log('Databse connection successful!');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(morgan('tiny')); // Logger

app.use('/', userRouter);
app.use('/', postRouter);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
