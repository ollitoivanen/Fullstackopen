import React from "react";

const Notification = ({ message, error }) => {
  if (!message) return null;
  return (
    <div style={error ? errorStyle : infoStyle}>
      <p style={textStyle}>{message}</p>
    </div>
  );
};

const errorStyle = {
  backgroundColor: "red",
};

const infoStyle = {
  backgroundColor: "lightGreen",
};

const textStyle = {
  padding: 8,
};

export default Notification;
