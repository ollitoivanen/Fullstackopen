import React from "react";

const NewContactForm = ({
  handleSubmit,
  handleNameChange,
  handlePnumberChange,
  newName,
  newPnumber,
}) => {
  return (
    <>
      <h2>Add new</h2>
      <form onSubmit={handleSubmit}>
        <p>Name</p>
        <input value={newName} onChange={handleNameChange} />
        <p>Phone number</p>
        <input value={newPnumber} onChange={handlePnumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default NewContactForm;
