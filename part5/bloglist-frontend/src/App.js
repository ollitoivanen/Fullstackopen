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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //setErrorMessage('wrong credentials')
      setTimeout(() => {
        //setErrorMessage(null)
      }, 5000)
    }  }

    const loginForm = () => (
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
    )

    const blogsList = () => (
    blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )
    )
return(
  <div>
  <h2>blogs</h2>
{  !user && loginForm()
}    {user && blogsList()}
  </div>

)
   
  
    
}

export default App