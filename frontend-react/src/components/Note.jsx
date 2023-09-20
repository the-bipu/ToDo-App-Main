import React from "react";

function Note(props) {

  const { id, title, dark, isChecked, handleCheckboxChange, onDelete } = props;

  // console.log()
  
  function handleClick() {
    console.log("passed the id " + id);
    onDelete(id);
  }
  
  console.log(`Note id: ${id}, isChecked: ${isChecked[id]}`);
  
  return (
    <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
      &nbsp;

      <div 
        type="text" 
        className={`checkbox--label ${isChecked[id] ? "checked--Input" : ""}`}
        name="checkbox--tasks" 
        checked={isChecked[id]} 
        onClick={() => handleCheckboxChange(id)}
      /> 
      
      <div className={`div--tasks ${isChecked[id] ? "completed--task" : ""}`}>
          {title}
      </div>

      <button className="button__delete" onClick={handleClick}>
        <img className="cross__icon" src="../../assets/images/icon-cross.svg" alt="cross icon" />
      </button>
    </div>
  );
}

export default Note;
