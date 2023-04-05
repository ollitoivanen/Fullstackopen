const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  if (process.env.NODE_ENV === 'test') {
    await User.deleteMany({});
    await User.create(helper.initialUser);
    await Blog.deleteMany({});
    await Blog.insertMany(helper.intitialBlogs);
  }
});

describe('When blogs are fetched', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.intitialBlogs.length);
  });

  test('returned blogs have id, not _id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    expect(titles).toContain(
      helper.intitialBlogs[0].title,
    );
  });
});

describe('When a blog is being added', () => {
  test('A blog can be added by a logged in user', async () => {
    const newBlog = {
      title: 'Testiblogi',
      author: 'Mikko Maa',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
      userId: helper.initialUser._id,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.generateToken()}`)
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

  test('A blog with no likes-key gets 0 likes', async () => {
    const newBlog = {
      title: 'Testiblogi 2',
      author: 'Mikko Maatila',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.generateToken()}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length + 1);

    const newBlogFromDB = blogsAtEnd.find((blog) => blog.title === newBlog.title);
    expect(newBlogFromDB.likes).toEqual(0);
  });

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Mikko Maa',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.generateToken()}`)
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
      .set('Authorization', `Bearer ${helper.generateToken()}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length);
  });

  test('request without token receives an error', async () => {
    const newBlog = {
      title: 'Testiblogi',
      author: 'Mikko Maa',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
      userId: helper.initialUser._id,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('user id is saved to the blog', async () => {
    const usersAtStart = await helper.usersInDb();
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
      .set('Authorization', `Bearer ${helper.generateToken()}`)
      .send({ ...blogToSave, userId: userToSave.id })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
    const savedBlog = blogsAtEnd.find((blog) => blog.title === blogToSave.title);
    expect(savedBlog.user.toString()).toEqual(userToSave.id);
  });

  test('blog id is saved to the user', async () => {
    const usersAtStart = await helper.usersInDb();
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
      .set('Authorization', `Bearer ${helper.generateToken()}`)
      .send({ ...blogToSave, userId: userToSave.id })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
    const savedBlog = blogsAtEnd.find((blog) => blog.title === blogToSave.title);
    const usersAtEnd = await helper.usersInDb();
    const savedUser = usersAtEnd.find((user) => user.id === userToSave.id);
    const blogInUser = savedUser.blogs.find((blog) => blog.toString() === savedBlog.id);
    expect(blogInUser).toBeDefined();
  });
});

describe('When deleting a blog', () => {
  test('A blog can be deleted by its owner', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${helper.generateToken()}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.intitialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('when there is initially one user in db', () => {
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
});

describe('When a blog is being updated', () => {
  test('blog updates successfully by its owner', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.title = 'Muuttunut otsikko';
    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
    expect(updatedBlog.title).toEqual('Muuttunut otsikko');
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
