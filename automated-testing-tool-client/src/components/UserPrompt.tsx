import React, {useState} from 'react';
import logo from '../images/open_book_logo.svg'
import MessageBlock from './MessageBlock';
import "./style/userPrompt.css"


interface IUserPrompt {
    msg: String,
    evaluation_state: String
}


const UserPrompt: React.FC<IUserPrompt>  = (props) => {
    
    return (
        <div className="global-prompt-container" >
            <div className="prompt-text">
                <p>{props.msg}</p>
            </div>
            <div className={`prompt-response-evaluation-${props.evaluation_state}`}>
                {props.evaluation_state==="correct"?<i className="fa-solid fa-circle-check"></i>:<i className="fa-solid fa-xmark"></i>}

                
            </div>

        </div>

    )
}


export default UserPrompt ;