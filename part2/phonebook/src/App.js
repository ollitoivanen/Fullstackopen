import { useState } from "react";
import ContactList from "./components/ContactList";
import Filter from "./components/Filter";
import NewContactForm from "./components/NewContactForm";
import Title from "./components/Title";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", pnumber: "040-123456" },
    { name: "Ada Lovelace", pnumber: "39-44-5323523" },
    { name: "Dan Abramov", pnumber: "12-43-234345" },
    { name: "Mary Poppendieck", pnumber: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPnumber, setNewPnumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (checkIfExists()) {
      alert(`${newName} is already added to the phonebook.`);
      return;
    }

    if (checkIfNotEmpty()) {
      alert("Add name and phone number");
      return;
    }
    const personObject = {
      name: newName,
      pnumber: newPnumber,
    };
    setPersons(persons.concat(personObject));
    setNewName("");
    setNewPnumber("");
  };

  const checkIfExists = () => {
    return persons.find((person) => person.name === newName);
  };

  const checkIfNotEmpty = () => {
    return newName.length === 0 || newPnumber.length === 0;
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handlePnumberChange = (event) => {
    setNewPnumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter((p) => p.name.toLowerCase().includes(filter));

  return (
    <div>
      <Title />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <NewContactForm
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handlePnumberChange={handlePnumberChange}
        newName={newName}
        newPnumber={newPnumber}
      />
      <ContactList personsToShow={personsToShow} />
    </div>
  );
};

export default App;
