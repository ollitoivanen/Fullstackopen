const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const middleware = require('../middleware/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1, name: 1,
  });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = await User.findById(request.user);
  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== request.user.toString()) {
    response.status(401).json({ error: 'Not authorized' });
    return;
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = request.body;
  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true, runValidators: true, context: 'query' });
  response.status(200).json(result);
});
module.exports = blogsRouter;
