import React from 'react';
import logo from '../images/open_book_logo.svg'
import "./style/header.css"

function Header(){
    return(
        <div id="header-main">
            <div id="left-side-header">
                <a href="https://openbook-playground.botpress.tools/"><img src={logo} width="180px" /></a>
                <p>PLAYGROUND</p> 
            </div>
            <div id="center-header">HOTEL CHATBOT</div>
            
            <div id="right-side-header">
                <i className="fa-solid fa-circle-thin fa-user-astronaut"></i>
            </div>

        </div>
    )
}

export default Header