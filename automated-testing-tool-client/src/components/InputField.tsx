import React, {useState} from 'react';
import "./style/inputField.css"
import Axios from 'axios'

interface IInputField {
    send_msg: (content: String, artifact_id: String) => void,
    send_thread: any
}


const InputField: React.FC<IInputField>  = (props) => {

    const [msg_content, set_msg_content] = useState("")
    const [artifact_id, set_artifact_id] = useState("")



    function handle_new_artifact_key() {
        Axios.post("http://localhost:3001/check_all_prior_responses",{
            artifact_id: artifact_id
        }).then((response)=>{
            console.log('Success! Response:')
            console.log(response)
            props.send_thread(response.data)
        }).catch((err)=>{
            console.log('Error!:')
            console.log(err)
        })
    }

    function handleClick() {

        if (artifact_id==="" || artifact_id.trim().length===0) {
            alert("Hi! Minor correction - artifact ID can not be null.")
        } else if (artifact_id.length<15) {
            alert("Hi, something seems off - please double check the artifact ID again.")
        } else if (typeof msg_content === 'string' && msg_content.length != 0 && msg_content.trim().length>0) {
            props.send_msg(msg_content, artifact_id)
            set_msg_content("")
        }
    }

    return(
        <div id="input-global-container">
            <div id="input-parent-container">
                <div className="input-cell">
                    <input value={msg_content} onChange={(e)=>set_msg_content(e.target.value)} onKeyDown={(key_pressed)=>key_pressed.key==='Enter'? handleClick(): null}/>             
                </div>
                <div className="button-cell">
                    <i className="fa-regular fa-paper-plane" onClick={handleClick}></i>
                </div>
            </div>
            <div id="artifact-parent-container">
                <p>Artifact 1, ID:</p><input onChange={(e)=>set_artifact_id(e.target.value)}/>
                <i className="fa-solid fa-key" onClick={handle_new_artifact_key}></i>
            </div>
        </div>
    )
}

export default InputField