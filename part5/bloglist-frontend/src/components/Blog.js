import { useState } from "react"

const Blog = ({blog}) => {
  const [expanded, setExpanded] = useState(false)

  

  const toggleExpanded = () => {
      setExpanded(!expanded)
  }

  const normalBlog = ()=> (
    <div style={{margin: 8}}>
      {blog.title} {blog.author}
      <button onClick={toggleExpanded}>view</button>
    </div> 
    )

  const expandedBlog = ()=> (
    <div style={{padding: 8, borderWidth: 2, borderColor: 'black', borderRadius:10, border: 'solid',
  }}>
      <div>
      {blog.title} {blog.author}
      <button onClick={toggleExpanded}>close</button>
      </div>
      <p>
        {blog.url}
      </p>
      <div>        
        Likes: {blog.likes}  
        <button>like</button>
      </div>
      <p>
      </p>
      <p>
        {blog.user.name}
      </p>
    </div> 
    )

  return(
    <>
    {expanded && expandedBlog()}
    {!expanded  && normalBlog()}
    </>
   
  ) 
}

export default Blog