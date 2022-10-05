import React, {useState, useEffect} from 'react';
import "./style/messageBlock.css";
import Axios from "axios"


interface IMessageBlock {
    user_prompt: String,
    bot_response: String,
    index: number,
    id: String,
    send_to_parent: any
}


const MessageBlock: React.FC<IMessageBlock>  = (props) => {




    const [response_evaluation, set_response_evaluation] = useState("undetermined")

    useEffect(()=>{
        console.log("response_evaluation")
        console.log(response_evaluation)
        
    },[response_evaluation])

    function handle_evaluation(user_eval:String) {
        if (user_eval==="correct"){
            if (response_evaluation ==="correct") {
                window.document.getElementsByClassName("fa-solid fa-thumbs-up")[props.index].classList.remove('active')
                set_response_evaluation("undetermined")
                submit_evaluation("undetermined")
            }else{
                window.document.getElementsByClassName("fa-solid fa-thumbs-up")[props.index].classList.add('active')
                window.document.getElementsByClassName("fa-solid fa-thumbs-down")[props.index].classList.remove('active')
                set_response_evaluation("correct")
                submit_evaluation("correct")
            }   
        } else {
            if (response_evaluation ==="incorrect") {
                window.document.getElementsByClassName("fa-solid fa-thumbs-down")[props.index].classList.remove('active')
                set_response_evaluation("undetermined")
                submit_evaluation("undetermined")
            }else{
                
                window.document.getElementsByClassName("fa-solid fa-thumbs-down")[props.index].classList.add('active')
                window.document.getElementsByClassName("fa-solid fa-thumbs-up")[props.index].classList.remove('active')
                set_response_evaluation("incorrect")
                submit_evaluation("incorrect")
            }   
        }
        
    }

    function submit_evaluation(usr_evaluation:String) {
        console.log('submit!')
        Axios.post("http://localhost:3001/submit-user-evaluation",{
            msg_id: props.id,
            user_assessment: usr_evaluation,
            chatbot_response: props.bot_response
        }).then((response)=>{
            console.log('Success! Response:')
            console.log(response.data)
            // set_message_thread(response.data)
            props.send_to_parent(response.data)
        }).catch((err)=>{
            console.log('Error!:')
            console.log(err)
        })
    }

    return(
        <div className='global-message-block'>
            <div className="user-message">
                <p>{props.user_prompt}</p>
            </div>
            <div className="chatbot-message">
                <p>{props.bot_response}</p>
                <i id='incorrect-button' className="fa-solid fa-thumbs-down" onClick={()=>handle_evaluation('incorrect')}></i>
                <i id='correct-button' className="fa-solid fa-thumbs-up" onClick={()=>handle_evaluation('correct')}></i>
            </div>
        </div>
    )
}

export default MessageBlock ;