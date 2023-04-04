const Blog = require('../models/blog');
const User = require('../models/user');

const intitialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
    user: '7a422a821b54a676236d17f2',
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
    user: '7a422a821b54a676236d17f2',
  },
];

const initialUsers = {
  _id: '7a422a821b54a676236d17f2',
  username: 'root',
  name: 'Mikko',
  passwordHash: '$2b$10$rkSI4cRJnVX0vl93ZaI7xeKY27l.yMFgZLpDU7wAzJHqTm44JiNFe',
  notes: [
    '5a422a851b54a676234d17f7',
    '5a422bc61b54a676234d17fc',
  ],
};

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  intitialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb,
};
