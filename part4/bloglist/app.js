const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

const errorHandler = (err, req, res, next) => {
  if ((err.name === 'ValidationError')) {
    res.status(400).send(err.message);
    return;
  }
  next(err);
};

app.use(errorHandler);

module.exports = app;
