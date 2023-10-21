import React,  { useState, useEffect } from "react";
import { useDrag, useDrop } from 'react-dnd';

import './Note.scss';

const Note = ({ id, title, onDelete, onEdit, dark, isChecked, handleCheckboxChange, index, moveNote }) => {
  const [, ref, preview] = useDrag({
      type: 'NOTE',
      item: { index }
  });

  const [, drop] = useDrop({
      accept: 'NOTE',
      hover: (draggedItem) => {
          if (draggedItem.index !== index) {
              moveNote(draggedItem.index, index);
              draggedItem.index = index;
          }
      }
  });

  const handleDrag = (e) => {
      e.preventDefault();
  }

  // function handleDeleteButtonClick() {
  //   console.log("passed the id " + id);
  //   onDelete(id);
  // }

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleDeleteButtonClick = () => {
    onDelete(id);
  }

  const handleEditButtonClick = () => {
    setIsEditing(true);
  }

  const handleSaveButtonClick = () => {
    setIsEditing(false);
    onEdit(id, editedTitle);
  }

  const handleInputChange = (e) => {
    setEditedTitle(e.target.value);
  }

  return (
      <div 
          ref={(node) => ref(drop(node))}
      >
          <div className={`div-main ${dark ? "div-main-dark" : ""} ${index === 0 ? 'unique' : ''}`}>
            &nbsp;

            <div 
              type="text" 
              className={`checkbox--label ${isChecked[id] ? "checked--Input" : ""}`}
              name="checkbox--tasks" 
              checked={isChecked[id]} 
              onClick={() => handleCheckboxChange(id)}
            /> 
            
            {/* <div className={`div--tasks ${isChecked[id] ? "completed--task" : ""}`}>
                {title}
            </div>

            <button className="button__edit" onClick={handleEditButtonClick}>
              <img className="pencil__icon icons--button" src="../../assets/images/pencil--1.png" alt="pencil icon" />
            </button>

            <button className="button__delete" onClick={handleDeleteButtonClick}>
              <img className="cross__icon icons--button" src="../../assets/images/delete--1.png" alt="delete icon" />
            </button> */}

            {isEditing ? (
              <input
                className="edit__input"
                type="text"
                value={editedTitle}
                onChange={handleInputChange}
                autoFocus
              />
            ) : (
              <div className={`div--tasks ${isChecked[id] ? "completed--task" : ""}`}>
                  {title}
              </div>
            )}

            {isEditing ? (
              <button className="button__save" onClick={handleSaveButtonClick}>
                Save
              </button>
            ) : (
              <>
                <button className="button__edit" onClick={handleEditButtonClick}>
                  <img className="pencil__icon icons--button" src="../../assets/images/pencil--1.png" alt="pencil icon" />
                </button>

                <button className="button__delete" onClick={handleDeleteButtonClick}>
                  <img className="cross__icon icons--button" src="../../assets/images/delete--1.png" alt="delete icon" />
                </button>
              </>
            )}
          </div>
      </div>
  );
}

// function Note(props) {

//   const { id, title, dark, isChecked, handleCheckboxChange, onDelete } = props;
  
//   function handleClick() {
//     console.log("passed the id " + id);
//     onDelete(id);
//   }
  
//   console.log(`Note id: ${id}, isChecked: ${isChecked[id]}`);
  
//   return (
//     <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
//       &nbsp;

//       <div 
//         type="text" 
//         className={`checkbox--label ${isChecked[id] ? "checked--Input" : ""}`}
//         name="checkbox--tasks" 
//         checked={isChecked[id]} 
//         onClick={() => handleCheckboxChange(id)}
//       /> 
      
//       <div className={`div--tasks ${isChecked[id] ? "completed--task" : ""}`}>
//           {title}
//       </div>

//       <button className="button__delete" onClick={handleClick}>
//         <img className="cross__icon" src="../../assets/images/icon-cross.svg" alt="cross icon" />
//       </button>
//     </div>
//   );
// }

export default Note;
