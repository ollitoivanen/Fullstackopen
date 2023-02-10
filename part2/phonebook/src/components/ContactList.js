import React from "react";
import Contact from "./Contact";

const ContactList = ({ personsToShow }) => {
  return (
    <>
      <h2>Numbers</h2>
      <table>
        <tbody>
          {personsToShow.map((person) => (
            <Contact person={person} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ContactList;
