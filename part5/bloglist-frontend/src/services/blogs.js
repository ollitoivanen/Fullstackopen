import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const put = async (newObject, objectId) => {
  const config = {
    headers: { Authorization: token },
  }
  const fullUrl = `${baseUrl}/${objectId}`
  const response = await axios.put(fullUrl, newObject, config)
  return response.data
}

const deleteBlog = async (objectId) => {
  const config = {
    headers: { Authorization: token },
  }
  const fullUrl = `${baseUrl}/${objectId}`
  const response = await axios.delete(fullUrl, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  response.data.sort(function(a, b) {
    return b.likes - a.likes

  })

  return response.data
}
export default { getAll, create, setToken, put, deleteBlog }