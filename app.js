const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/api/tourRouter');
const userRouter = require('./routes/api/userRouter');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => next());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
