import React from 'react'
import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import app from '../Firebase/Firebase'
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
export default function Login(props) {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Google sign-in successful
        const user = result.user;
        props.setLogin("All");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEmailPasswordLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Email/password sign-in successful
        const user = userCredential.user;
        props.setLogin("All");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEmailPasswordSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Email/password signup successful
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div> <div class="desk-login">
    <div class="desk-login-child"></div>
    <div onClick={handleEmailPasswordLogin} class="desk-login-login-btn">
      <img
        class="desk-login-login-btn-child"
        alt=""
        src="./public/rectangle-23.svg"
      />

      <div class="log-in">Log In</div>
    </div>
    <div class="forget-password">Forget Password?</div>
    <div class="desk-login-password">
      {/* <img
        class="desk-login-password-child"
        alt=""
        src="./public/rectangle-18.svg"
      /> */}

<input value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder='Password'  style={{ background:"none", color:"white",width:"230px",height:"25px",fontSize:"14px"}} name='password' type='text'></input>
      <img
        class="desk-login-eyeicon"
        alt=""
        src="./public/desk-login-eyeicon.svg"
      />
    </div>
  
      <img class="desk-login-logomain" alt="" src="./public/vector.svg" />
    
    <div onClick={()=>props.setLogin("All")} class="home1">HOME</div>
    <div class="already-a-member">Already a member</div>
    <div class="desk-login-email">
      {/* <img
        class="desk-login-password-child"
        alt=""
        src="./public/rectangle-18.svg"
      /> */}

<input placeholder='Email'  value={email}
          onChange={(e) => setEmail(e.target.value)} style={{ background:"none", color:"white",width:"230px",height:"25px",fontSize:"14px"}} name='email' type='email'></input>
      <img class="group-icon1" alt="" src="./public/group1.svg" />
    </div>
    <div onClick={handleGoogleLogin} class="desk-login-google">
      <img
        class="desk-login-login-btn-child"
        alt=""
        src="./public/rectangle-23.svg"
      />

      <img
        class="desk-google-icon"
        alt=""
        src="./public/desk-google-icon.svg"
      />

      <div class="continue-with-google">Continue with Google</div>
    </div>
    <img
      class="desk-login-img-icon"
      alt=""
      src="./public/desk-login-img@2x.png"
    />

    <div class="start-for-free">START FOR FREE</div>
    <div class="border">
      <img class="border-child" alt="" src="./public/line-4.svg" />

      <img class="border-item" alt="" src="./public/line-4.svg" />

      <div class="or">or</div>
    </div>
  </div></div>
  )
}
