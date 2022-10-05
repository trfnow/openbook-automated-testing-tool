import React, {useState} from 'react';
import logo from '../images/open_book_logo.svg'
import MessageBlock from './MessageBlock';
import "./style/messageBox.css"


interface IMessageBox {
    thread: {
        user_message: String,
        chatbot_response:   String,
        correct_response:   String,
        createdAt: String,
        response_assessment: String,
        updatedAt: String,
        __v: Number,
        _id: String        
        }[],
    send_to_right_panel: any

}


const MessageBox: React.FC<IMessageBox>  = (props) => {

    function send_upwards(data:any) {
        props.send_to_right_panel(data)
    }
    
    return (
        <div className="global-container"  id="style-2">
            <div className="parent-container"  >
                {props.thread.map((convo, i)=>{
                    console.log(i)
                    if (convo.user_message !="") {
                        setTimeout(() => {
                            var forum:any = window.document.getElementById('style-2')
                            forum.scrollBy(0, 500)
                        }, 150);
                        return (
                            <MessageBlock key={i} index={i} id={convo._id} send_to_parent={send_upwards} user_prompt={convo.user_message} bot_response={convo.chatbot_response}/>
                        )
                    }
                })


                }  

    
            </div> 

        </div>

    )
}


export default MessageBox ;