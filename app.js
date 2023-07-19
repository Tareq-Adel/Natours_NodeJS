const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();
console.log(process.env.NODE_ENV + ' environment');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('common'));
  // app.use(morgan('dev'));
  // app.use(morgan('tiny'));
}

const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour`,
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`./public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // It will send to next Error Hanller middleware.
});

app.use(globalErrorHandler);

module.exports = app;
