const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Input validate date: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('JWT must be provided. Please login again.', 400);

const handleTokenExpiredError = () =>
  new AppError('JWT expired. Please login again', 400);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.includes('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.includes('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something wrong on server',
      });
    }
  }
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: 'Something weng wrong',
      message: err.message,
    });
  } else {
    res.status(500).render('error', {
      title: 'Something weng wrong',
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateErrorDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') err = handleTokenExpiredError();
    sendErrorProd(err, req, res);
  }
};
