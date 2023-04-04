const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  if (process.env.NODE_ENV === 'test') {
    await User.deleteMany({});
    await User.create(helper.initialUsers);
    await Blog.deleteMany({});
    const result = await Blog.insertMany(helper.intitialBlogs);
    console.log('Straight', result[0]._id);
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

// 4.8
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.intitialBlogs.length);
});

// 4.9
test('returned blogs have id, not _id', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

// 4.10
test('A blog can be added', async () => {
  const newBlog = {
    title: 'Testiblogi',
    author: 'Mikko Maa',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length + 1);

  const titles = blogsAtEnd.map((r) => r.title);
  expect(titles).toContain(
    newBlog.title,
  );
});

// 4.11
test('Blog with no likes-key gets 0 likes', async () => {
  const newBlog = {
    title: 'Testiblogi 2',
    author: 'Mikko Maatila',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length + 1);

  const newBlogFromDB = blogsAtEnd.find((blog) => blog.title === newBlog.title);
  expect(newBlogFromDB.likes).toEqual(0);
});
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');
  const titles = response.body.map((r) => r.title);
  expect(titles).toContain(
    helper.intitialBlogs[0].title,
  );
});

// 4.12
test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Mikko Maa',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length);
});

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Testiblogi',
    author: 'Mikko Maa',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length);
});

// 4.13
test('A blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);
  expect(titles).not.toContain(blogToDelete.title);
});

// 4.14
test('Blog likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];
  blogToUpdate.likes = 200;
  await api.put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length);

  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
  expect(updatedBlog.likes).toEqual(blogToUpdate.likes);
});

describe('when there is initially one user at db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'olliteed',
      name: 'olba',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /text\/html/);

    expect(result.error.text).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails properly if username does not exist', async () => {
    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /text\/html/);
    expect(result.error.text).toContain('User validation failed: username: Path `username` is required.');
  });
});
test('creation fails properly if username is shorter than 3', async () => {
  const newUser = {
    username: 'eo',
    name: 'Superuser',
    password: 'salainen',
  };
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /text\/html/);
  expect(result.error.text).toContain('User validation failed: username: Path `username` (`eo`) is shorter than the minimum allowed length (3).');
});

test('creation fails properly if password does not exist', async () => {
  const newUser = {
    username: 'olba',
    name: 'Superuser',
  };
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /text\/html/);
  expect(result.error.text).toContain('Please give a password over 2 characters long');
});

test('creation fails properly if password is shorter than 3', async () => {
  const newUser = {
    username: 'olba',
    name: 'Superuser',
    password: 'oh',
  };
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /text\/html/);
  expect(result.error.text).toContain('Please give a password over 2 characters long');
});

describe('When a blog is added to db', () => {
  test('user id is saved to the blog', async () => {
    const usersAtStart = await helper.usersInDb();
    console.log('usersAtStart', usersAtStart);
    const userToSave = usersAtStart[0];
    const blogsAtStart = await helper.blogsInDb();
    const blogToSave = {
      title: 'Testiblogi',
      author: 'Mikko Maa',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .send({ ...blogToSave, userId: userToSave.id })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
    const savedBlog = blogsAtEnd.find((blog) => blog.title === blogToSave.title);
    console.log('saved blog', savedBlog, userToSave.id);
    expect(savedBlog.user).toEqual(userToSave.id);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
