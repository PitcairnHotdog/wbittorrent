'use client'
import * as React from 'react';
import { useState, useRef } from "react"
import "./LoginPanel.css";

export default function LoginPanel() {

    const loginUser = (username, password) =>{
        console.log("signed in");
    }

    const userNameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleRegisterSubmit = (e) =>{
        e.preventDefault();

        const userName = userNameRef.current.value;
        const password = passwordRef.current.value;

        loginUser(userName, password);
    }

    return (
        <form class="complex_form" id="login" method="POST" enctype="multipart/form-data">
        <h1 class="form_title">Sign In</h1>
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
        <a href="#" class="forgetlink">Forget your password?</a>
        <input type="submit" class="btn" onClick={handleRegisterSubmit}/>
      </form>
    );
}