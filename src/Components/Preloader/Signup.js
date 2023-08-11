import React from 'react';
import { useState } from 'react';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, set ,child } from 'firebase/database';


import app from '../Firebase/Firebase'


export default function Signup(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [lastname, setlastname] = useState("");

  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignup = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Google sign-up successful
        const user = result.user;
        
        const googleDisplayName = user.displayName; // Get the user's display name from Google

      

        // Or update it in the database here
        const db = getDatabase();
        const userNodeRef = ref(db, 'Channels/' + user.uid + '/profile');
        set(userNodeRef, {
          name: googleDisplayName,
        });
        props.setLogin("All");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEmailPasswordSignup = () => {
   
    

   
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        // Create a user node with the desired structure inside the "Channels" node
        const db = getDatabase();
        const userNodeRef = ref(db, 'Channels/' + uid + '/profile');
        set(userNodeRef, {
          name: fullname+ " " +lastname,
        });
         
          setEmail("");
          setPassword("");
        props.setLogin("All");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div><div class="desk-signup">
    <img
      class="desk-main-bg-icon"
      alt=""
      src="./public/desk-main-bg@2x.png"
    />

    <div class="desk-signup-child"></div>
    <img class="icon" alt="" src="./public/desk-login-img@2x.png" />

    <div class="desk-signup-last-name">
      {/* <img
        class="desk-signup-last-name-child"
        alt=""
        src="./public/rectangle-16.svg"
      /> */}

      <img
        class="desk-signup-last-name-item"
        alt=""
        src="./public/group-44.svg"
      />
<input placeholder='Last name'  style={{ background:"none", color:"white",width:"90px",height:"25px",fontSize:"14px"}} id='last' name='lastname' type='text' onChange={(e)=>setlastname(e.target.value)}></input>
    </div>
    <div onClick={handleEmailPasswordSignup} class="desk-signup-create-acc-btn">
      <img
        class="desk-login-login-btn-child"
        alt=""
        src="./public/rectangle-23.svg"
      />

      <div class="create-account">Create Account</div>
    </div>
    <div class="desk-signup-firstname">
      {/* <img
        class="desk-signup-last-name-child"
        alt=""
        src="./public/rectangle-16.svg"
      /> */}

      <img
        class="desk-signup-firstname-item"
        alt=""
        src="./public/group-44.svg"
      />
<input  placeholder='First name'  style={{ background:"none", color:"white",width:"90px",height:"25px",fontSize:"14px"}} name='firstname' type='text' id='first' onChange={(e)=>setFullname(e.target.value)}></input>
     
    </div>
    <div style={{cursor:"pointer"}} onClick={()=>props.setLogin("login")} class="already-a-memberlog-container">
      <span>Already A Member?</span>
      <span class="log-in1">Log In</span>
    </div>
   
      <img class="desk-signup-logo-main" alt="" src="./public/vector.svg" />
    
    <div class="create-new-account">Create new account</div>
    <div style={{cursor:"pointer"}} onClick={()=>props.setLogin("All")} class="home2">HOME</div>
    <div class="start-for-free1">START FOR FREE</div>
    <div onClick={handleGoogleSignup} class="desk-signup-google-btn">
      <img
        class="desk-login-login-btn-child"
        alt=""
        src="./public/rectangle-23.svg"
      />

      <div class="continue-with-google1">Continue with Google</div>
      <img
        class="icons8-google-1"
        alt=""
        src="./public/icons8google-1.svg"
      />
    </div>
    <div class="desk-signup-email">
    <input value={email}
  onChange={(e) => setEmail(e.target.value)} id='email' placeholder='Email'  style={{ background:"none", color:"white",width:"230px",height:"25px",fontSize:"14px"}} type='email' name='email'></input>
      <img
        class="email-icon-1"
        alt=""
        src="./public/211660-email-icon-1.svg"
      />
      {/* <img
        class="desk-signup-email-child"
        alt=""
        src="./public/rectangle-17.svg"
      /> */}


    </div>
    <div class="desk-signup-password">
      {/* <img
        class="desk-signup-email-child"
        alt=""
        src="./public/rectangle-17.svg"
      /> */}

<input   value={password}
  onChange={(e) => setPassword(e.target.value)} placeholder='Password'  style={{ background:"none", color:"white",width:"230px",height:"25px",fontSize:"14px"}} name='password' type='text'></input>
      <img class="eye-icon-1" alt="" src="./public/216194-eye-icon-1.svg" />
    </div>
  </div></div>
  )
}
