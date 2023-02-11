import { useState, useEffect } from "react";
import ContactList from "./components/ContactList";
import Filter from "./components/Filter";
import NewContactForm from "./components/NewContactForm";
import Notification from "./components/Notification";
import Title from "./components/Title";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState({
    message: null,
    error: null,
  });

  const [newName, setNewName] = useState("");
  const [newPnumber, setNewPnumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleDelete = (person) => {
    const { name, id } = person;
    if (!window.confirm(`Do you really want to delete ${name}?`)) return;
    personService.deletePerson(id).then(() => {
      setPersons(persons.filter((p) => p.id !== id));
      showNotification(
        `Contact ${person.name} was deleted succesfully.`,
        false
      );
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
      personService
        .updatePerson(personObject)
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== updatedPerson.id ? p : updatedPerson))
          );
          showNotification(
            `Contact ${existingPerson.name} was updated succesfully.`,
            false
          );
        })
        .catch((e) => {
          showNotification(
            `Contact ${existingPerson.name} has already been removed from the server.`,
            true
          );
          setPersons(persons.filter((p) => p.id !== existingPerson.id));
        });
      return;
    }
    const personObject = {
      name: newName,
      number: newPnumber,
    };

    personService.addPerson(personObject).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      showNotification(
        `Contact ${newPerson.name} was added succesfully.`,
        false
      );
      setNewName("");
      setNewPnumber("");
    });
  };

  const checkIfExists = () => {
    return persons.find((person) => person.name === newName);
  };

  const confirmUpdate = () => {
    return window.confirm(
      `${newName} is already added to the phonebook. Do you want to replace the old number with a new one?`
    );
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

  const showNotification = (message, error) => {
    setNotification({
      message,
      error,
    });
    setTimeout(() => {
      setNotification({ message: null, error: null });
    }, 3000);
  };

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter((p) => p.name.toLowerCase().includes(filter));

  return (
    <div>
      <Title />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Notification message={notification.message} error={notification.error} />
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
