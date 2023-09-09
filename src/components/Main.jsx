import React from "react";
import { useEffect } from "react";
import Note from "./Note";
import CreateArea from "./CreateArea";

export default function Main(){

    const [isChecked, setIsChecked] = React.useState(false);
    const handleCheckboxChange = () => {
        console.log("Checkbox clicked");
        setIsChecked(!isChecked);
    }

    const [dark, setDark] = React.useState(false);
    function toggleDarkMode(){
        setDark(!dark);
    }

    useEffect(() => {
        document.body.style.backgroundColor = dark ? 'hsl(235, 21%, 11%)' : 'hsl(236, 33%, 92%)';
        document.body.style.backgroundImage = dark ? 'url(./assets/images/bg-desktop-dark.jpg)' : 'url(./assets/images/bg-desktop-light.jpg)';
      }, [dark]);


    // Working Models

    const [notes, setNotes] = React.useState([]);

    function addNote(newNote) {
        if (newNote.title.trim() !== "") {
            setNotes(prevNotes => {
                return [...prevNotes, newNote];
            });
        }
        // setNotes(prevNotes => {
        // return [...prevNotes, newNote];
        // });
    }

    function deleteNote(id) {
        setNotes(prevNotes => {
        return prevNotes.filter((noteItem, index) => {
            return index !== id;
        });
        });
    }

    return (
        <div className="container">
            <div className="navbar">
                <div className="heading">
                    Todo
                </div>
                <div className={`color--mode ${dark ? "color--mode-dark" : ""}`} onClick={toggleDarkMode}>
                </div>
            </div>

            <CreateArea onAdd={addNote} dark={dark} toggleDarkMode={toggleDarkMode} />

            {/* <div className={`input--field ${dark ? "input--field-dark" : ""}`}>
                <input type="text" className="checkbox--label main-button" name="checkbox--main" checked={isChecked} onChange={handleCheckboxChange} /> 
                &nbsp;
                <input type="text" className={`input--Main ${dark ? "input--Main-dark" : ""}`} placeholder="Create a new todo..." />
            </div> */}

            {/* <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
                &nbsp;
                <input type="checkbox" className={`checkbox--label ${isChecked ? "checked--Input" : ""}`} name="checkbox--tasks" checked={isChecked} onChange={handleCheckboxChange} /> 
                
                <div className="div--tasks">
                    Complete Todo App on Frontend Mentor
                </div>
            </div>

            <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
                &nbsp;
                <input type="checkbox" className={`checkbox--label ${isChecked ? "checked--Input" : ""}`} name="checkbox--tasks" checked={isChecked} onChange={handleCheckboxChange} /> 
                
                <div className="div--tasks">
                    Complete Todo App on Frontend Mentor
                </div>
            </div> */}

            <div>
                {notes.map((noteItem, index) => {
                    return (
                    <Note
                        key={index}
                        id={index}
                        title={noteItem.title}
                        onDelete={deleteNote}
                        dark={dark} 
                        isChecked={isChecked} 
                        handleCheckboxChange={handleCheckboxChange}
                    />
                    );
                })}
            </div>

            <div className={`footer-main ${dark ? "footer-main--dark" : ""}`}>
                <div className="items--con">
                    5 items left
                </div>
                <div className="status--con">
                    <div className={`all ${dark ? "all--dark" : ""}`}>All</div> &nbsp; &nbsp;
                    <div className={`active ${dark ? "active--dark" : ""}`}>Active</div> &nbsp; &nbsp;
                    <div className={`complete ${dark ? "complete--dark" : ""}`}>Complete</div>
                </div>
                <div className="clear--con">
                    Clear Completed
                </div>
            </div>

            <div className="footer--last">
                Drag and drop to reorder list
            </div>
        </div>
    )
}
