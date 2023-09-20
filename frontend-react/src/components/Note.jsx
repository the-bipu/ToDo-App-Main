import React from "react";
import { useDrag, useDrop } from 'react-dnd';

const Note = ({ id, title, onDelete, dark, isChecked, handleCheckboxChange, index, moveNote }) => {
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

  function handleClick() {
    console.log("passed the id " + id);
    onDelete(id);
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
            
            <div className={`div--tasks ${isChecked[id] ? "completed--task" : ""}`}>
                {title}
            </div>

            <button className="button__delete" onClick={handleClick}>
              <img className="cross__icon" src="../../assets/images/icon-cross.svg" alt="cross icon" />
            </button>
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
