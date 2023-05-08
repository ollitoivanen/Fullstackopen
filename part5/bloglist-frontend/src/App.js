import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

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
      //noteService.setToken(user.token)
    }
  }, [])



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      ) 
    } catch (exception) {
      //setErrorMessage('wrong credentials')
      setTimeout(() => {
        //setErrorMessage(null)
      }, 5000)
    }  
  }

  const handleLogout = () => {
      window.localStorage.removeItem('loggedBloglistUser');
      setUser(null)
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

    const blogsList = () => (
    <>
    <h2>blogs</h2>
    <p>{`${user.name} logged in`}</p>
    <button onClick={handleLogout}>logout</button>
    {blogs.map(blog => 
      <Blog key={blog.id} blog={blog} />
    )}
    </>
    )
return(
  <div>
{  !user && loginForm()
}    {user && blogsList()}
  </div>

)
   
  
    
}

export default App