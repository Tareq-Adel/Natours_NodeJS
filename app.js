const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();
console.log(process.env.NODE_ENV + ' environment');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('common'));
  // app.use(morgan('dev'));
  // app.use(morgan('tiny'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public/overriew.html`));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
