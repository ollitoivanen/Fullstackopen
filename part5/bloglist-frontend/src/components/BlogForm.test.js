import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls onSubmit with right data', async () => {
  const blogObject = {
    title: 'Testi',
    author: 'Kirjoittaja',
    url: 'Testiurl',
    likes:0
  }
  const userForEvent = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('save')

  await userForEvent.type(inputs[0], blogObject.author)
  await userForEvent.type(inputs[1], blogObject.title)
  await userForEvent.type(inputs[2], blogObject.url)

  await userForEvent.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blogObject)
})