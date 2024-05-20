const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/api/tourRouter');
const userRouter = require('./routes/api/userRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server !`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
