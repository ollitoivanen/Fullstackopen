import React from "react";

const Contact = ({ person, handleDelete }) => {
  const { name, number } = person;
  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{number}</td>
        <td>
          <button onClick={handleDelete}>Delete</button>
        </td>
      </tr>
    </>
  );
};

export default Contact;
