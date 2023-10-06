import React, { useState, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import './Main.scss';


export default function Main(){

    // Light and Dark Mode 
    const [dark, setDark] = useState(false);
    function toggleDarkMode(){
        setDark(!dark);
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 600px)");
    
        const applyDarkStyles = () => {
            document.body.style.backgroundImage = dark ? 'url(./assets/images/bg-desktop-dark.jpg)' : 'url(./assets/images/bg-desktop-light.jpg)';
            document.body.style.backgroundColor = dark ? 'hsl(235, 21%, 11%)' : 'hsl(236, 33%, 92%)';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundSize = '100% 44vh';
        };

        const applyMobileStyles = () => {
            if (!dark) {
                document.body.style.backgroundImage = 'url(./assets/images/bg-mobile-' + (dark ? 'dark' : 'light') + '.jpg)';
                document.body.style.backgroundColor = dark ? 'hsl(235, 21%, 11%)' : 'hsl(236, 33%, 92%)';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundSize = '100% 44vh';
            }
        };
    
        applyDarkStyles(); // Apply styles initially
        if (mediaQuery.matches) {
            applyMobileStyles(); // Apply mobile styles initially if window is less than 600px wide
        }

        const mediaQueryListener = (event) => {
            if (event.matches) {
                applyMobileStyles(); // Apply mobile styles if window becomes less than 600px wide
            } else {
                applyDarkStyles(); // Apply desktop styles if window becomes 600px wide or wider
            }
        };
        
        mediaQuery.addEventListener('change', mediaQueryListener);
    
        return () => {
            mediaQuery.removeEventListener('change', mediaQueryListener);
        };
    }, [dark]);

    // UseStates Here

    const [formData, setFormData] = useState({ title: '' });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [activeSection, setActiveSection] = useState("All");

    const [notes, setNotes] = useState([]);
    const [isChecked, setIsChecked] = useState({});

    const [uncheckedNotesCount, setUncheckedNotesCount] = useState(0);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    useEffect(() => {
        // Fetch data from MongoDB
        axios.get('http://localhost:5555/todos')
            .then(response => {
                const notesWithCheck = response.data.map((item, index) => ({ ...item, id: index, isChecked: item.isChecked }));
                const initialCheckedState = {};
                response.data.forEach((item, index) => {
                    initialCheckedState[index] = item.isChecked;
                });
                setIsChecked(initialCheckedState);
                setNotes(notesWithCheck);
                setLoading(false);
                setUncheckedNotesCount(notesWithCheck.filter(note => !note.isChecked).length);
            })
            .catch(error => {
                console.error('Error fetching data from MongoDB:', error);
                setLoading(false);
            });
    }, []);

    const filteredNotes = activeSection === "All"
        ? notes
        : notes.filter(note => {
            if (activeSection === "Active") {
                return !note.isChecked;
            } else if (activeSection === "Complete") {
                return note.isChecked;
            }
            return true;
        });

    const handleSectionToggle = (section) => {
        setActiveSection(section);
    }

    const addNote = (newNote) => {
        if (newNote.title.trim() !== "") {
            const data = {
                title: newNote.title,
                isChecked: false
            };

            axios.post('http://localhost:5555/todos', data)
                .then(response => {
                    setIsFormSubmitted(true);
                    setNotes(prevNotes => [...prevNotes, { ...response.data, id: response.data._id, isChecked: false }]);
                    setLoading(false);
                    setUncheckedNotesCount(prevCount => prevCount + 1);
                })
                .catch(error => {
                    console.error('Error creating data in MongoDB:', error);
                    setLoading(false);
                });
        } else {
            console.error('Title cannot be empty.');
            return;
        }
    }

    const handleCheckboxChange = (id) => {
        setIsChecked(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        const documentId = notes.find(note => note.id === id)._id;

        axios.put(`http://localhost:5555/todos/${documentId}`, { isChecked: !isChecked[id] })
            .then(() => {
                console.log(`Successfully updated isChecked for document with ID ${documentId} in MongoDB.`);
                handleSectionToggle(activeSection);

                if (isChecked[id]) {
                    setUncheckedNotesCount(prevCount => prevCount + 1);
                } else {
                    setUncheckedNotesCount(prevCount => prevCount - 1);
                }

                setNotes(prevNotes => prevNotes.map(note =>
                    note.id === id ? { ...note, isChecked: !isChecked[id] } : note
                ));
            })
            .catch(error => {
                console.error('Error updating isChecked in MongoDB:', error);
            });
    }

    const deleteNote = (id) => {
        const documentId = notes.find(note => note.id === id)._id;
        axios.delete(`http://localhost:5555/todos/${documentId}`)
            .then(() => {
                console.log(`Successfully deleted document with ID ${id} from MongoDB.`);
                setUncheckedNotesCount(prevCount => prevCount - 1);
                setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            })
            .catch(error => {
                console.error('Error deleting document from MongoDB:', error);
            });
    }

    const clearCompleted = () => {
        const completedNotes = notes.filter(note => note.isChecked);

        completedNotes.forEach(note => {
            const documentId = note._id;

            axios.delete(`http://localhost:5555/todos/${documentId}`)
                .then(() => {
                    console.log(`Successfully deleted completed document with ID ${note.id} from MongoDB.`);

                    setNotes(prevNotes => prevNotes.filter(n => n._id !== note._id));
                    setIsChecked(prev => {
                        const newState = { ...prev };
                        delete newState[note.id];
                        return newState;
                    });
                })
                .catch(error => {
                    console.error('Error deleting document from MongoDB:', error);
                });
        });
    }

    const moveNote = (dragIndex, hoverIndex) => {
        const dragNote = notes[dragIndex];
        const updatedNotes = [...notes];
        updatedNotes.splice(dragIndex, 1);
        updatedNotes.splice(hoverIndex, 0, dragNote);
        setNotes(updatedNotes);
    };
    

    return (
        <div className="container">
            <div className="navbar">
                <div className="heading">
                    Todo
                </div>
                <div className={`color--mode ${dark ? "color--mode-dark" : ""}`} onClick={toggleDarkMode}>
                </div>
            </div>

            <CreateArea onAdd={addNote} dark={dark} toggleDarkMode={toggleDarkMode} clearCompleted={clearCompleted} />

            <DndProvider backend={HTML5Backend}>
                <div>
                    {filteredNotes.map((noteItem, index) => (
                        <Note
                            key={index}
                            index={index}
                            id={noteItem.id}
                            title={noteItem.title}
                            onDelete={deleteNote}
                            dark={dark}
                            isChecked={isChecked}
                            handleCheckboxChange={handleCheckboxChange}
                            moveNote={moveNote}
                        />
                    ))}
                </div>
            </DndProvider>

            <div className={`footer-main ${dark ? "footer-main--dark" : ""}`}>
                <div className="items--con">
                    {uncheckedNotesCount} items left
                </div>

                <div className="status--con">
                    <div className={`all ${dark ? "all--dark" : ""} 
                                    ${activeSection === "All" ? "active--status" : ""}`}
                        onClick={() => handleSectionToggle("All")}
                    >
                        All
                    </div>

                    &nbsp; &nbsp;

                    <div className={`active ${dark ? "active--dark" : ""} 
                                    ${activeSection === "Active" ? "active--status" : ""}`}
                        onClick={() => handleSectionToggle("Active")}
                    >
                        Active
                    </div>

                    &nbsp; &nbsp;

                    <div className={`complete ${dark ? "complete--dark" : ""} 
                                    ${activeSection === "Complete" ? "active--status" : ""}`}
                        onClick={() => handleSectionToggle("Complete")}
                    >
                        Complete
                    </div>
                </div>

                <div className={`clear--con ${dark ? "clear--con--dark" : ""}`} onClick={clearCompleted} >
                    Clear Completed
                </div>
            </div>

            <div className={`status--con--mobile ${dark ? "status--con--mobile--dark" : ""}`}>
                <div className={`all ${dark ? "all--dark" : ""}
                    ${activeSection === "All" ? "active--status--mobile" : ""}`}
                    onClick={() => handleSectionToggle("All")}
                >
                    All
                </div>

                &nbsp; &nbsp;

                <div className={`active ${dark ? "active--dark" : ""}
                    ${activeSection === "Active" ? "active--status--mobile" : ""}`}
                    onClick={() => handleSectionToggle("Active")}
                >
                    Active
                </div>

                &nbsp; &nbsp;

                <div className={`complete ${dark ? "complete--dark" : ""}
                    ${activeSection === "Complete" ? "active--status--mobile" : ""}`}
                    onClick={() => handleSectionToggle("Complete")}
                >
                    Complete
                </div>
            </div>

            <div className="footer--last">
                Drag and drop to reorder list
            </div>
        </div>
    )
}
