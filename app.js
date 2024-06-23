const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/api/tourRouter');
const userRouter = require('./routes/api/userRouter');
const reviewRouter = require('./routes/api/reviewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');
const viewRouter = require('./routes/web/viewRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARE
// Security HTTP headers
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https://api.mapbox.com',
          'ws://localhost:41255/',
          'https://unpkg.com',
        ],
        'worker-src': [
          "'self'",
          'http://localhost:3000',
          'https://api.mapbox.com',
          'ws://localhost:41255/',
          'https://unpkg.com',
          'blob:',
        ],
        'connect-src': [
          "'self'",
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'ws://localhost:41255/',
          'https://unpkg.com',
        ],
      },
    },
  }),
);

// development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// limting request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP address, please try again in an hour !',
});
app.use('/api', limiter);

// reading data from body to req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(cookieParser());

// sanitize query like email:  { "$gt": "" }
app.use(mongoSanitize());

// cross side attacking with html code
app.use(xss());

// Prevent parameters pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  }),
);

// Serving static rendering
app.use(express.static(path.join(__dirname, 'public')));

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

// ROUTES
// web routes
app.use('/', viewRouter);

// api rotes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server !`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
