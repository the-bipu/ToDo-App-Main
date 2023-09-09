import React, { useState } from "react";

function CreateArea(props) {

  const { dark, toggleDarkMode, isChecked, handleCheckboxChange } = props;

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
      setNote({
        title: "",
      });
    event.preventDefault();

    // function submitNote() {
    //   if (note.title.trim() !== "") {
    //     props.onAdd(note);
    //     setNote({
    //       title: "",
    //     });
    //   }
    // }

  }

  return (
      <div className={`input--field ${dark ? "input--field-dark" : ""}`}>
        <button type="submit" className="checkbox--label main-button" name="checkbox--main" onClick={submitNote} /> 
        &nbsp;
        <input type="text" className={`input--Main ${dark ? "input--Main-dark" : ""}`} placeholder="Create a new todo..." onChange={handleChange} value={note.title} name="title" autoComplete="off" />
      </div>
  );
}

export default CreateArea;
