import React, {useState} from 'react';
import logo from '../images/open_book_logo.svg'
import InputField from './InputField';
import MessageBox from './MessageBox';
import "./style/rightPanel.css";
import Axios from "axios"


interface IRightPanel {
    send_thread_to_app: any
}


const RightPanel: React.FC<IRightPanel>  = (props) => {

    const [left_panel_expanded, set_left_panel_expanded] = useState(false)
    const [message_thread, set_message_thread] = useState([{
        user_message: "",
        chatbot_response:   "",
        correct_response:   "",
        createdAt: "",
        response_assessment: "",
        updatedAt: "",
        __v: 0,
        _id: ""}])

    function send_msg_to_chatbot(content:String, artifact_id: String) {
        console.log("Let's ask a quesion!")
        console.log(content)
        Axios.post("http://localhost:3001/submit-message-and-receive-response",{
            user_msg: content,
            artifact_id: artifact_id
        }).then((response)=>{
            console.log('Success! Response:')
            console.log(response.data)
            set_message_thread(response.data)
            props.send_thread_to_app(response.data)
        }).catch((err)=>{
            console.log('Error!:')
            console.log(err)
        })
    }

    function handle_new_thread(new_thread:any) {
        props.send_thread_to_app(new_thread)
        console.log("new_thread")
        console.log(new_thread)
    }

    return(
        <div className='right-panel-parent'>
            <MessageBox send_to_right_panel={handle_new_thread} thread={message_thread}/>
            <InputField send_msg={send_msg_to_chatbot} send_thread={handle_new_thread}/>
        </div>
    )
}

export default RightPanel ;