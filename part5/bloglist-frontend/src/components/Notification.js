import PropTypes from 'prop-types'

const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (
    <div style={{
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string
}

export default Notification