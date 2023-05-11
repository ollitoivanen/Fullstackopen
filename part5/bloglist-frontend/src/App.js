import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

import loginService from './services/login'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [message, setMessage] = useState(null)
  

  const blogFormRef = useRef()




  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])



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
      window.localStorage.removeItem('loggedBloglistUser');
      setUser(null)
  }

  const addBlog = async (blogObject) => {
    
    try {
      await blogService.create(blogObject)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
      
      setMessage('Post saved successfully')
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setMessage('Error with saving post')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }  
    }
   

  
  
    const loginForm = () => (
      <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>  
      </>    
    )

    const blogsView = () => (
      <>
      <h2>blogs</h2>
      <p>{`${user.name} logged in`}</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel={'New blog'} ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
        </Togglable>
     
      {blogs.map(blog => 
        <Blog key={blog.id} blog={blog} />
      )}
      </>
    )
  
return(
  <div>
    <Notification message={message} />

    {!user && loginForm()}
    {user && blogsView()}
  </div>

)
   
  
} 


export default App