import React, { useState, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';

import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

import { client } from '../client';

export default function Main(){

    // Light and Dark Mode 
    const [dark, setDark] = useState(false);
    function toggleDarkMode(){
        setDark(!dark);
    }

    useEffect(() => {
        document.body.style.backgroundColor = dark ? 'hsl(235, 21%, 11%)' : 'hsl(236, 33%, 92%)';
        document.body.style.backgroundImage = dark ? 'url(./assets/images/bg-desktop-dark.jpg)' : 'url(./assets/images/bg-desktop-light.jpg)';
      }, [dark]);

    
    // Usestates Needed

    const [formData, setFormData] = useState({ message: '' });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [activeSection, setActiveSection] = useState("All");
    
    const [notes, setNotes] = useState([]);
    const [isChecked, setIsChecked] = useState({}); // Change to an object instead of a boolean
    
    const [uncheckedNotesCount, setUncheckedNotesCount] = useState(
        notes.filter(note => !note.isChecked).length
    );

    const { message } = formData;

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    useEffect(() => {
        // Fetch data from Sanity
        client.fetch(`*[_type == 'database']`).then(data => {
            
            const notesWithCheck = data.map((item, index) => ({ ...item, id: index, isChecked: item.isChecked }));

            const initialCheckedState = {};
            data.forEach((item, index) => {
                initialCheckedState[index] = item.isChecked;
            });
            setIsChecked(initialCheckedState);

            setNotes(notesWithCheck);
            setLoading(false);

            notesWithCheck.forEach(item => {
                console.log(`ID: ${item.id}, Title: ${item.title}, Index: ${item.id}, IsChecked: ${item.isChecked}`);
            });

            setUncheckedNotesCount(notesWithCheck.filter(note => !note.isChecked).length);

        }).catch(error => {
            console.error('Error fetching data from Sanity:', error);
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
        console.log(`Active section changed to: ${section}`);
        setActiveSection(section);
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }

    function addNote(newNote) {
        if (newNote.title.trim() !== "") {
            const uniqueId = uuidv4();
            const data = {
                _type: 'database',
                _id: uniqueId,
                title: newNote.title,
                isChecked: false
            }
    
            client.create(data)
                .then(() => {
                    setIsFormSubmitted(true);
                    setNotes(prevNotes => [...prevNotes, { ...data, id: prevNotes.length, isChecked: false }]);
                    setLoading(false);
                    setUncheckedNotesCount(prevCount => prevCount + 1);
                })
                .catch(error => {
                    console.error('Error creating data in Sanity:', error);
                    setLoading(false);
                });
        } else {
            console.error('Title cannot be empty.');
            return;
        }
    }    

    // funtion for handling the check box change
    const handleCheckboxChange = (id) => {
        setIsChecked(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        const documentId = notes.find(note => note.id === id)._id;

        client
            .patch(documentId)
            .set({ isChecked: !isChecked[id] })
            .commit()
            .then(() => {
                console.log(`Successfully updated isChecked for document with ID ${documentId} in Sanity.`);
                handleSectionToggle(activeSection);

                console.log(isChecked[id]);

                if(isChecked[id]) { setUncheckedNotesCount(prevCount => prevCount + 1); }
                else {  setUncheckedNotesCount(prevCount => prevCount - 1); }

                // Working code don't remove
                setNotes(prevNotes => prevNotes.map(note => 
                    note.id === id ? { ...note, isChecked: !isChecked[id] } : note
                ));

                // Use this for sending the checked and unchecked data at the last of the list
                // setNotes(prevNotes => {
                //     const updatedNotes = prevNotes.map(note => 
                //         note.id === id ? { ...note, isChecked: !isChecked[id] } : note
                //     );

                //     // Move the unchecked item to the end of the list
                //     const uncheckedItem = updatedNotes.find(note => note.id === id);
                //     const updatedList = updatedNotes.filter(note => note.id !== id);
                //     updatedList.push(uncheckedItem);

                //     return updatedList;
                // });

                // Use this for sending only the checked data to the end
                // const wasChecked = isChecked[id];
                // setNotes(prevNotes => {
                //     const updatedNotes = prevNotes.map(note => 
                //         note.id === id ? { ...note, isChecked: !isChecked[id] } : note
                //     );
    
                //     if (wasChecked) {
                //         // Move the unchecked item to the end of the list
                //         const uncheckedItem = updatedNotes.find(note => note.id === id);
                //         const updatedList = updatedNotes.filter(note => note.id !== id);
                //         updatedList.push(uncheckedItem);
    
                //         return updatedList;
                //     } else {
                //         return updatedNotes;
                //     }
                // });
            })
            .catch(error => {
                console.error('Error updating isChecked in Sanity:', error);
            });
    }

    // function for deletion
    function deleteNote(id) {
        setNotes(prevNotes => {
            const updatedNotes = prevNotes.filter((noteItem, index) => index !== id);
            return updatedNotes;
        });

        // setNotes(prevNotes => {
        //     return prevNotes.filter((noteItem, index) => {
        //         console.log("This is from the delete section : " + index + " " + id);
        //         return index !== id;
        //     });
        // });

        const documentId = notes.find(note => note.id === id)._id;
        console.log("This is the document id : " + documentId);

        client
            .delete(documentId)
            .then(() => {
                console.log(`Successfully deleted document with ID ${id} from Sanity.`);

                setUncheckedNotesCount(prevCount => prevCount - 1);

                setNotes(prevNotes => prevNotes.map(note => 
                    note.id === id ? { ...note, isChecked: !isChecked[id] } : note
                ));
            })
            .catch(error => {
                console.error('Error deleting document from Sanity:', error);
            });
    }

    const clearCompleted = () => {
        const completedNotes = notes.filter(note => note.isChecked);
    
        completedNotes.forEach(note => {
            const documentId = note._id;
    
            client
                .delete(documentId)
                .then(() => {
                    console.log(`Successfully deleted completed document with ID ${note.id} from Sanity.`);

                    // Update the local state after deletion
                    setNotes(prevNotes => prevNotes.filter(n => n._id !== note._id));
                    setIsChecked(prev => {
                        const newState = { ...prev };
                        delete newState[note.id];
                        return newState;
                    });
                })
                .catch(error => {
                    console.error('Error deleting document from Sanity:', error);
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

            {/* <CreateArea onAdd={addNote} dark={dark} toggleDarkMode={toggleDarkMode} onSaveToSanity={handleSaveToSanity} /> */}
            <CreateArea onAdd={addNote} dark={dark} toggleDarkMode={toggleDarkMode} clearCompleted={clearCompleted} />

            {/* <Note id={1} title={"Complete the To-Do-App Project"} />
            <Note id={2} title={"Adding Backend to the To-Do-App Project"} /> */}

            {/* <div>
                {filteredNotes.map((noteItem, index) => {
                    return (
                    <Note
                        key={index}
                        id={noteItem.id}
                        title={noteItem.title}
                        onDelete={deleteNote}
                        dark={dark} 
                        isChecked={isChecked}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                    );
                })}
            </div> */}

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
                <div className={`clear--con`} onClick={clearCompleted} >
                    Clear Completed
                </div>
            </div>

            <div className="footer--last">
                Drag and drop to reorder list
            </div>
        </div>
    )
}
