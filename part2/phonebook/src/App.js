import { useState, useEffect } from "react";
import ContactList from "./components/ContactList";
import Filter from "./components/Filter";
import NewContactForm from "./components/NewContactForm";
import Title from "./components/Title";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newPnumber, setNewPnumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleDelete = (person) => {
    const { name, id } = person;
    if (!window.confirm(`Do you really want to delete ${name}?`)) return;
    personService.deletePerson(id).then(() => {
      setPersons(persons.filter((p) => p.id !== id));
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (checkIfNotEmpty()) {
      alert("Add name and phone number");
      return;
    }

    const existingPerson = checkIfExists();
    if (existingPerson) {
      if (!confirmUpdate()) return;
      const personObject = { ...existingPerson, number: newPnumber };
      personService.updatePerson(personObject).then((updatedPerson) => {
        console.log(updatedPerson);
        setPersons(
          persons.map((p) => (p.id !== updatedPerson.id ? p : updatedPerson))
        );
      });
      return;
    }
    const personObject = {
      name: newName,
      number: newPnumber,
    };

    personService.addPerson(personObject).then((newPerson) => {
      setPersons(persons.concat(newPerson));
    });
    setNewName("");
    setNewPnumber("");
  };

  const confirmUpdate = () => {
    return window.confirm(
      `${newName} is already added to the phonebook. Do you want to replace the old number with a new one?`
    );
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
      <ContactList personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
