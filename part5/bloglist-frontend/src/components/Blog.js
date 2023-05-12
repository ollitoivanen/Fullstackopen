import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const normalBlog = () => (
    <div style={{ margin: 8 }}>
      {`${blog.title}, ${blog.author}`}
      <button id="view-button" onClick={toggleExpanded}>view</button>
    </div>
  )

  const expandedBlog = () => (
    <div style={{ padding: 8, borderWidth: 2, borderColor: 'black', borderRadius:10, border: 'solid',
    }}>
      <div>
        {`${blog.title}, ${blog.author}`}
        <button id="close-button" onClick={toggleExpanded}>close</button>
      </div>
      <p>
        {blog.url}
      </p>
      <div>
        Likes: {blog.likes}
        <button id="like-button" onClick={() => onLike(blog)}>like</button>
      </div>
      <p>
      </p>
      <p>
        {blog.user.name}
      </p>
      {blog.user.id === user.id ? <button id="delete-button" onClick={() => onDelete(blog)}>Delete</button>: null}

    </div>
  )

  return(
    <div className="blog">
      {expanded && expandedBlog()}
      {!expanded  && normalBlog()}
    </div>

  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default Blog