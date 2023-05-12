import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders only title and author by default', () => {
  const blog = {
    id: '635d2a8f58f3e9242ff7340a',
    title: 'Testi',
    author: 'Jest',
    url: 'hhtps',
    likes: 0,
    user:{
      id: '645d295a58f3e9242ff733fa',
      name: 'Olba',
      username: 'olska'
    }
  }

  /* const user = {
    id: '645d295a58f3e9242ff733fa',
    name: 'Olba',
    token: 'eyJhbGciOiJIUzI1Nihdhrs5cCI6IkpXgsrgsgrsVubmkiLCJpZCI6IjY0NWQyOTVhNThmM2U5MjQyZmY3MzNmYSIsImlhdCI6MTY4MzkwMTI3NX0.C8YKhsmYWs_y2MM8HpXPjOtlKS6-f7wEM1CMlfSMJoQ',
    username: 'olska',
  }*/



  render(<Blog blog={blog} />)

  const titleAndAuthor = screen.queryByText('Testi, Jest')
  const url = screen.queryByText(blog.url)
  const likes = screen.queryByText(blog.likes)

  expect(titleAndAuthor).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})