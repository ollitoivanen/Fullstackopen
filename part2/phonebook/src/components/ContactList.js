import React from "react";
import Contact from "./Contact";

const ContactList = ({ personsToShow, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>
      <table>
        <tbody>
          {personsToShow.map((person) => (
            <Contact
              key={person.name}
              person={person}
              handleDelete={() => handleDelete(person)}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ContactList;
