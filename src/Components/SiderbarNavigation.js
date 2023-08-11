import React from 'react'
import { getAuth, signOut } from 'firebase/auth';
import { useState } from 'react';
export default function SiderbarNavigation(props) {

  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  const handleLogout = () => {
 
    signOut(auth)
      .then(() => {
        
        props.setLogin("login"); 
      })
      .catch((error) => {
        console.error(error);
      });
  };
 
  return (
    <div>
      <div class="desk-side-naviagtion">
          <div class="desk-side-naviagtion-premium">
            <div class="desk-side-naviagtion-premium-child"></div>
            <b class="premium">Premium</b>
          </div>
        
             <img class="desk-side-naviagtion-logo-main" alt="" src="./public/vector.svg" />
        
          <div class="desk-side-naviagtion-items">
            <div  onClick={handleLogout} class="desk-side-naviagtion-items-log">
              <div class="logout">{currentUserId === "" ? "Logout":"Signup"}</div>
              <img class="vector-icon1" alt="" src="./public/vector1.svg" />
            </div>
            <div  onClick={()=>props.setActive("Home")} class={`desk-side-naviagtion-items-hom${props.active =="Home"? " activecolor":" inactivecolor"}`}>
              <div class="home">Home</div>
              <img
               class="desk-side-naviagtion-items-hom-child"
                alt=""
                src="./public/group-4.svg"
              />
            </div>
            <div onClick={()=>props.setActive("Mypost")}  class={`desk-side-naviagtion-items-myp${props.active =="Mypost"? " activecolor":" inactivecolor"}`}>
              <div class="my-post">My Post</div>
              <img class="group-icon" alt="" src="./public/group.svg" />
            </div>
            <div onClick={()=>props.setActive("Setting")}  class={`desk-side-naviagtion-items-set${props.active =="Setting"? " activecolor":" inactivecolor"}`}>
              <div class="settings">Minting</div>
              <img class="vector-icon2" alt="" src="./public/vector2.svg" />
            </div>
            <div onClick={()=>props.setActive("Cart")}  class={`desk-side-naviagtion-items-car${props.active =="Cart"? " activecolor":" inactivecolor"}`}>
              <div class="cart-wrapper">
                <div class="cart">Trending</div>
              </div>
              <img
                class="desk-side-naviagtion-items-car-child"
                alt=""
                src="./public/group-28.svg"
              />
            </div>
            <div onClick={()=>props.setActive("Mychannel")}  class={`desk-side-naviagtion-items-cha${props.active =="Mychannel"? " activecolor":" inactivecolor"}`}>
              <div class="channel">
                <p class="channel1">Channel</p>
              </div>
              <img
                class="desk-side-naviagtion-items-cha-child"
                alt=""
                src="./public/group-45.svg"
              />
            </div>
          </div>
        </div>


    </div>
  )
}
