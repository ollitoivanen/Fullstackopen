import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }  
  }

  const handleLogout = () => {
      window.localStorage.removeItem('loggedBloglistUser');
      setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
      likes:0
    }
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setAuthor('')
        setTitle('')
        setUrl('')

      })
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
    {!user && loginForm()}
    {user && blogsView()}
  </div>

)
   
  
    
}

export default App