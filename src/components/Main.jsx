import React from "react";
import { useEffect } from "react";

export default function Main(){

    const [dark, setDark] = React.useState(false);

    function toggleDarkMode(){
        setDark(!dark);
    }

    useEffect(() => {
        document.body.style.backgroundColor = dark ? 'hsl(235, 21%, 11%)' : 'hsl(236, 33%, 92%)';
        document.body.style.backgroundImage = dark ? 'url(./assets/images/bg-desktop-dark.jpg)' : 'url(./assets/images/bg-desktop-light.jpg)';
      }, [dark]);

    return (
        <div className="container">
            <div className="navbar">
                <div className="heading">
                    Todo
                </div>
                <div className={`color--mode ${dark ? "color--mode-dark" : ""}`} onClick={toggleDarkMode}>
                </div>
            </div>

            <div className={`input--field ${dark ? "input--field-dark" : ""}`}>
                <input type="text" className="checkbox--label main-button" name="checkbox--main" /> 
                &nbsp;
                <input type="text" className={`input--Main ${dark ? "input--Main-dark" : ""}`} placeholder="Create a new todo..." />
            </div>

            <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
                &nbsp;
                <input type="text" className="checkbox--label" name="checkbox--tasks" /> 
                
                <div className="div--tasks">
                    Complete Todo App on Frontend Mentor
                </div>
            </div>

            <div className={`div-main ${dark ? "div-main-dark" : ""}`}>
                &nbsp;
                <input type="text" className="checkbox--label" name="checkbox--tasks" /> 
                
                <div className="div--tasks">
                    Complete Todo App on Frontend Mentor
                </div>
            </div>

            <div className={`footer-main ${dark ? "footer-main--dark" : ""}`}>
                <div className="items--con">
                    5 items left
                </div>
                <div className="status--con">
                    <div className="all">All</div> &nbsp; &nbsp;
                    <div className="active">Active</div> &nbsp; &nbsp;
                    <div className="complete">Complete</div>
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