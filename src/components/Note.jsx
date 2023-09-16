import React from "react";

function Note(props) {

  const { id, title, dark, isChecked, handleCheckboxChange, onDelete } = props;

  function handleClick() {
    onDelete(id);
  }

  return (
    <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
      &nbsp;
      <input type="text" className={`checkbox--label ${isChecked ? "checked--Input" : ""}`} name="checkbox--tasks" checked={isChecked} onChange={handleCheckboxChange} /> 
      
      <div className="div--tasks">
          {title}
      </div>

      <button className="button__delete" onClick={handleClick}>
        <img className="cross__icon" src="../../assets/images/icon-cross.svg" alt="cross icon" />
      </button>
    </div>
  );
}

export default Note;
