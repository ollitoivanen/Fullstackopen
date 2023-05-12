import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

import loginService from './services/login'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)


  const blogFormRef = useRef()




  useEffect(() => {
    const fetch = async () => {
      const blogs = await blogService.getAll()
      setBlogs( blogs )
      console.log(blogs)
    }
    fetch()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleUsernameChange = (username) => {
    setUsername(username)
  }

  const handlePasswordChange = (password) => {
    setPassword(password)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)

      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {

    try {
      await blogService.create(blogObject)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)

      setMessage('Post saved successfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setMessage('Error with saving post')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async(blog) => {
    const { user, likes, author, title, url } = blog
    console.log(blog)
    const blogObject = {
      user: user.id,
      likes: likes + 1,
      author,
      title,
      url,
    }
    await blogService.put(blogObject, blog.id)
    const newBlogs = await blogService.getAll()
    setBlogs(newBlogs)

  }

  const deleteBlog = async (blog) => {
    console.log('blog', blog)
    if(!window.confirm(`Do you want to delete blog ${blog.title}?`)) return
    try {
      await blogService.deleteBlog(blog.id)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    } catch (error) {
      setMessage('Error with deleting post')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

  }

  const blogsView = () => (
    <>
      <h2>blogs</h2>
      <p>{`${user.name} logged in`}</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel={'New blog'} ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} onLike={likeBlog} onDelete={deleteBlog}/>
      )}
    </>
  )

  return(
    <div>
      <Notification message={message} />

      {!user && <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        handleUsernameChange={handleUsernameChange}
        handlePasswordChange={handlePasswordChange}/>}
      {user && blogsView()}
    </div>

  )


}


export default App