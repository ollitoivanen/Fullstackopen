const jwt = require('jsonwebtoken');

const errorHandler = (err, req, res, next) => {
  if ((err.name === 'ValidationError')) {
    res.status(400).send(err.message);
    return;
  } if (err.name === 'JsonWebTokenError') {
    res.status(400).send('token missing or invalid');
    return;
  }
  res.status(400).json({ error: err.message });

  next(err);
};

const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token invalid' });
    next();
  }

  const token = authorization.replace('Bearer ', '');

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    res.status(401).json({ error: 'token invalid' });
  }
  req.user = decodedToken.id;
  next();
};

module.exports = { errorHandler, userExtractor };
