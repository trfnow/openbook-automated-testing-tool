import React, {useState} from 'react';
import './App.css';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {

  const [thread, set_thread] = useState([{
    user_message: "",
    chatbot_response:   "",
    correct_response:   {determined: false, value: ""},
    createdAt: "",
    response_assessment: "",
    updatedAt: "",
    __v: 0,
    _id: ""}])
    const [msg_changed, set_msg_changed] = useState([{
      user_message: "",
      chatbot_response:   "",
      correct_response:   "",
      createdAt: "",
      response_assessment: "",
      updatedAt: "",
      __v: 0,
      _id: ""}])

    function send_to_app(data:any) {
      console.log('new thread data!')
      console.log(data)
      set_thread(data)
    }
    function send_single_change_to_app(data:any) {
      set_msg_changed([data])
    }

  return (
    <div className="App">
      <Header />
      <div className="panels">
        <LeftPanel thread={thread} />
        <RightPanel send_thread_to_app={send_to_app} />
      </div>
    </div>
  );
}

export default App;
