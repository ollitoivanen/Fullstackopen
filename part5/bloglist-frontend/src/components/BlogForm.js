import PropTypes from 'prop-types'

import React, { useState } from 'react'

const BlogForm =({ createBlog }) => {

  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
      likes:0
    }
    createBlog(blogObject)
    setAuthor('')
    setTitle('')
    setUrl('')
  }
  return (
    <>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>

        <div style={{ content: 'flex', flexDirection: 'row' }}>
          <p>Author</p>
          <input
            id="author"
            title="Author"
            value={author}
            onChange={handleAuthorChange}
          />
          <p>Title</p>
          <input
            id="title"
            title="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <p>Url</p>
          <input
            id="url"
            title="Url"
            value={url}
            onChange={handleUrlChange}
          />
          <button type="submit">save</button>
        </div>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm