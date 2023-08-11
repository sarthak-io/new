import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set, get, remove } from 'firebase/database';
import Header from '../Header'
import Live from './Live';
import Expired from './Expired';
import New from './New';
import Edit from './Edit'
const backgroundImageUrl = './public/pop.svg'
export default function MyPostMain(props) {
  const [active, setActive] = useState("live");
  const [editMode, setEditMode] = useState("All");
  const [showPopup, setShowPopup] = useState(false);
  const [id, setId] = useState(0);
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  const db = getDatabase();

  const handleEditEdit = (e) => {
    setId(e);
    setShowPopup(true);
    console.log("clicked");

  };

  const close = () => {
    setShowPopup(false);
  };
  const deletePost = () => {

    if (!currentUserId || !id) {
      // Ensure both currentUserId and id are available
      return;
    }

    const postRef = ref(db, `Channels/${currentUserId}/posts/${id}`);
    remove(postRef)
      .then(() => {
        toast.success('Post deleted successfully');
        setShowPopup(false);
        // Close the delete popup or perform any other actions after successful deletion
        close();
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  const updatePost = () => {
    setEditMode("edit");
  }



  return (

    <div><Header balance={props.balance} /> <div class="desk-my-post">
      <img
        class="desk-main-bg-icon"
        alt=""
        src="./public/desk-main-bg@2x.png"
      />

      <div class="desk-my-post-view">
        {editMode === "All" &&
          <div class="desk-my-post-bodymain">
            <img
              class="desk-my-post-bodymain-child"
              alt=""
              src="./public/rectangle-15.svg"
            />
            <div style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }} className={`del-popup${showPopup ? '  show' : ' hide'}`}>

              <img src='./public/close.svg' className='close' onClick={close}></img>
              <b class="post-del">Are You sure to delete this post?{id}</b>
              <div onClick={deletePost} style={{ cursor: "pointer", left: "5rem" }} class="desk-my-post-bodymain-content2-pop">
                <div class="desk-my-post-bodymain-content2-child"></div>
                <b class="post">Delete</b>
              </div>
              <div onClick={updatePost} style={{ cursor: "pointer" }} class="desk-my-post-bodymain-content2-pop">
                <div class="desk-my-post-bodymain-content2-child"></div>
                <b class="post">Edit</b>
              </div>
            </div>

            <div class="desk-my-post-navigation">
              <div onClick={() => setActive("live")} class="desk-my-post-navigation-live">
                <div className={`desk-my-post-navigation-live-child${active === "live" ? " active" : ""}`}></div>
                <div class="live">LIVE</div>
                <div class="greendot"></div>
              </div>
              <div onClick={() => setActive("expired")} class="desk-my-post-navigation-expire">
                <div className={`desk-my-post-navigation-expire-child${active === "expired" ? " active" : ""}`}></div>
                <div class="expired">EXPIRED</div>
                <div class="reddot"></div>
              </div>
              <div onClick={() => setActive("new")} class="desk-my-post-navigation-new">
                <div className={`desk-my-post-navigation-new-child${active === "new" ? " active" : ""}`}></div>
                <div class="new">NEW</div>
                <img class="plus-icon" alt="" src="./public/plus.svg" />
              </div>
            </div>
            {active == "live" &&
              <><Live handleEdit={handleEditEdit} /></>}
            {active == "new" &&
              <><New address={props.address} /></>}
            {active == "expired" &&
              <><Expired handleEdit={handleEditEdit} /></>}


          </div>}


        {editMode === "edit" && <Edit id={id} setEditMode={setEditMode} />}
        <ToastContainer />
      </div>


    </div></div>
  )
}
