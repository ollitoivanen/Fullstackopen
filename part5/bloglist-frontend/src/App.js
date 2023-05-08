import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

import loginService from './services/login'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [message, setMessage] = useState(null)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')



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

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
      likes:0
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setAuthor('')
      setTitle('')
      setUrl('')
      setMessage('Post saved successfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Error with saving post')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }  
    }
   

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
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
      <form onSubmit={addBlog}>
      <div style={{content: 'flex', flexDirection: 'row'}}>
      <p>Author</p>
          <input
            title="Author"
            value={author}
            onChange={handleAuthorChange}
          />
      <p>Title</p>
          <input
            title="Title"
            value={title}
            onChange={handleTitleChange}
          />
        <p>Url</p>
          <input
            title="Url"
            value={url}
            onChange={handleUrlChange}
          />
          <button type="submit">save</button>
          </div>
        </form>  
      <p>{`${user.name} logged in`}</p>
      <button onClick={handleLogout}>logout</button>
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