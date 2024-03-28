'use client'
import * as React from 'react';
import { useState, useRef } from "react"
import "./LoginPanel.css";

export default function SignupPanel() {
    const addUser = (username, email, password) =>{
        console.log("signed up");
    }

    const userNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleRegisterSubmit = (e) =>{
        e.preventDefault();

        const userName = userNameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        addUser(userName, email, password);
    }

    return (
        <form class="complex_form" id="signup" method="POST" enctype="multipart/form-data"> 
        <h1 class="form_title">Sign Up</h1>
        <input
          type="text"
          name="username"
          class="form_element"
          placeholder="Username"
          required
          ref={userNameRef}
        />
        <input
          type="password"
          name="password"
          class="form_element"
          placeholder="Password"
          required
          ref={passwordRef}
        />
        <input
          type="text"
          name="email"
          class="form_element"
          placeholder="Email"
          required
          ref={emailRef}
        />
        <input type="submit" class="btn" onClick={handleRegisterSubmit}/>
      </form>
    );
}