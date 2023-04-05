const errorHandler = (err, req, res, next) => {
  if ((err.name === 'ValidationError')) {
    res.status(400).send(err.message);
    return;
  } if (err.name === 'JsonWebTokenError') {
    res.status(400).send('token missing or invalid');
    return;
  }
  next(err);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    req.token = token;
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
