import React, {useState, useEffect} from 'react';
import logo from '../images/open_book_logo.svg'
import "./style/leftPanel.css"
import UserPrompt from './UserPrompt';


interface ILeftPanel {
    thread: {
        user_message: String,
        chatbot_response:   String,
        correct_response:   {determined: Boolean, value: String},
        createdAt: String,
        response_assessment: String,
        updatedAt: String,
        __v: Number,
        _id: String        
        }[]

}


const LeftPanel: React.FC<ILeftPanel>  = (props) => {

    const [left_panel_expanded, set_left_panel_expanded] = useState(false)


    useEffect(()=>{
        console.log("thread has changed")
        console.log(props.thread)

        console.log("OR")
        console.log("single thread has changed")



    },[props.thread])

    function toggle_left_panel() {

        if (left_panel_expanded) {
            window.document.getElementById("left-panel")?.classList.remove('expand')
        } else{
            window.document.getElementById("left-panel")?.classList.add('expand')
        }
        set_left_panel_expanded(!left_panel_expanded)

        
    }

    return(
        <div className='left-panel-parent' id="left-panel">
            <div className="top-title">
                <p>Performance Analysis</p>
                <i className={left_panel_expanded ? "i-tag fa-solid fa-arrow-left" : "i-tag fa-solid fa-arrow-right"} onClick={toggle_left_panel}></i>
            </div>
            <div className="top-container" id="style-23">

                {props.thread!.map((prompt, i)=>{
                    var eval_state = ""
                    console.log(i)
                    if (prompt.user_message !="") {
                        setTimeout(() => {
                            var forum:any = window.document.getElementById('style-2')
                            forum.scrollBy(0, 500)
                        }, 150);
                        if (prompt.response_assessment==="correct") {
                            eval_state = "correct"
                        } else if (prompt.response_assessment==="incorrect"){
                            eval_state = "incorrect"
                        }else if (prompt.response_assessment==="correct-correct"){
                            eval_state = "correct"
                        }else if (prompt.response_assessment==="correct-incorrect"){
                            eval_state = "correct-incorrect"
                        }else{
                            eval_state = "undetermined"
                        }
                        return (<UserPrompt msg={prompt.user_message} key={i} evaluation_state={eval_state} />)
                    }
                })}



                
            </div>
            <div className="bottom-container">
                <div className="legend">
                    <p>LEGEND</p>
                </div>
                <div className="correct">
                    <p>CORRECT</p>
                </div>
                x = previously correct, now incorrect
                <div className="incorrect">
                    <p>INCORRECT</p>
                </div>
                <div className="undetermined">
                    <p>UNDETERMINED</p>
                </div>
            </div>
        </div>
    )
}

export default LeftPanel ;