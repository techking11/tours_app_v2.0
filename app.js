const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

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
          "'self'", // allow scripts from your own domain
          "'unsafe-inline'", // allow inline scripts
          'https://api.mapbox.com', // allow scripts from the Mapbox CDN
          'https://unpkg.com', // allow scripts from the unpkg CDN
        ],
        'worker-src': [
          "'self'", // allow web workers from your own domain
          'http://localhost:3000', // allow web workers from the current host
          'https://api.mapbox.com', // allow web workers from the Mapbox CDN
          'https://unpkg.com', // allow web workers from the unpkg CDN
          'blob:', // allow web workers from blob URLs
        ],
        'connect-src': [
          "'self'", // allow connections to your own domain
          'https://api.mapbox.com', // allow connections to the Mapbox API
          'https://events.mapbox.com', // allow connections to Mapbox events
          'https://unpkg.com', // alllow connections to unpkg events
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
