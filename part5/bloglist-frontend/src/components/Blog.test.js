import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

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

const user = {
  id: '645d295a58f3e9242ff733fa',
  name: 'Olba',
  token: 'eyJhbGciOiJIUzI1Nihdhrs5cCI6IkpXgsrgsgrsVubmkiLCJpZCI6IjY0NWQyOTVhNThmM2U5MjQyZmY3MzNmYSIsImlhdCI6MTY4MzkwMTI3NX0.C8YKhsmYWs_y2MM8HpXPjOtlKS6-f7wEM1CMlfSMJoQ',
  username: 'olska',
}

test('renders only title and author by default', () => {

  render(<Blog blog={blog} />)

  const titleAndAuthor = screen.queryByText('Testi, Jest')
  const url = screen.queryByText(blog.url)
  const likes = screen.queryByText(blog.likes)

  expect(titleAndAuthor).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('clicking the view-button shows url, likes and user', async () => {

  render(
    <Blog blog={blog} user={user}/>
  )

  const userForEvent = userEvent.setup()
  const button = screen.getByText('view')
  await userForEvent.click(button)

  const titleAndAuthor = screen.queryByText('Testi, Jest')
  const url = screen.queryByText(blog.url)
  const likes = screen.queryByText(blog.likes)
  const userName = screen.queryByText(blog.user.name)

  expect(titleAndAuthor).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(userName).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} user={user} onLike={mockHandler}/>
  )
  const userForEvent = userEvent.setup()

  const viewButton = screen.getByText('view')
  await userForEvent.click(viewButton)

  const likeButton = screen.getByText('like')
  await userForEvent.dblClick(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})