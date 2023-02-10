import React from "react";

const Contact = ({ person }) => {
  const { name, pnumber } = person;
  return (
    <div>
      <tr>
        <td>{name}</td>
        <td>{pnumber}</td>
      </tr>
    </div>
  );
};

export default Contact;
