import React, { useState } from "react";

import './CreateArea.scss';

function CreateArea(props) {

  const {onAdd, dark, toggleDarkMode, isChecked, handleCheckboxChange } = props;

  const [message, setMessage] = useState('');

  const [note, setNote] = useState({
    title: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
      props.onAdd(note);

      // props.onSaveToSanity(note.title);

      setNote({
        title: "",
        isChecked: false
      });
    event.preventDefault();

  }

    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd({ title: message });
      setMessage('');
  }

  return (
      <div className={`input--field ${dark ? "input--field-dark" : ""}`}>
        <div type="submit" className="add--button" name="checkbox--main" onClick={submitNote} /> 
        &nbsp;
        <input type="text" className={`input--Main ${dark ? "input--Main-dark" : ""}`} placeholder="Create a new todo..." 
        onChange={handleChange} value={note.title} name="title" autoComplete="off" />
      </div>
  );
}

export default CreateArea;
