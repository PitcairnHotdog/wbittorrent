'use client'
import React, { useState, useEffect} from "react";
import "../components/LoginPanel.css";
import LoginPanel from "../components/LoginPanel.js"
import SignupPanel from "../components/SignupPanel.js"

export default function Login(props){
    const [isActive, setIsActive] = useState(false);

    const handleToggle = (e) => {
        setIsActive(current => !current);
    }

    const username = "";
    const email = "";
    const password = "";

    return (
        <div id="loginPage">

            <p id="error_box"></p>

            <div className ={`container ${isActive ? 'active' : ''}`} id="container">

                <LoginPanel />

                <SignupPanel /> 

                <div class="toggle_container">
                    <div class="toggle">
                        <div class="toggle_panel toggle_left">
                            <h2>Welcome Back</h2>
                            <p>login with your user name and password</p>
                            <button class="btn" id="toggle_login" onClick={handleToggle}>Sign In Now</button>
                        </div>
                        <div class="toggle_panel toggle_right">
                            <h2>New User?</h2>
                            <p>Sign up with your email</p>
                            <button class="btn" id="toggle_signup" onClick={handleToggle}>Sign Up Now</button>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
            <a href="#">credits</a>
            </footer>

        </div>
    );
}