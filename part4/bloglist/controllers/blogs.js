const jwt = require('jsonwebtoken');

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1, name: 1,
  });
  response.json(blogs);
});

const getTokenFrom = (request) => {
  console.log('täällä');
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogsRouter.post('/', async (request, response) => {
  console.log('hi');
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  console.log('decodedToken', decodedToken);
  if (!decodedToken.id) {
    response.status(401).json({ error: 'token invalid' });
    return;
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = request.body;
  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true, runValidators: true, context: 'query' });
  response.status(200).json(result);
});
module.exports = blogsRouter;
