import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set ,get} from 'firebase/database';
import { getAuth } from 'firebase/auth';
export default function PostCard(props) {
  const [countdown, setCountdown] = useState(props.durationInSeconds);
  const db = getDatabase();
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if(countdown !=0){
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
  
    return () => {
      clearInterval(timer);
      // Update the duration in the database before unmounting
      if (props.durationInSeconds !== undefined) {
        const postRef = ref(
          db,
          `Channels/${currentUserId}/posts/${props.id}/durationInSeconds`
        );
  
        // Check if the post still exists before updating the duration
        get(postRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              set(postRef, countdown).catch((error) => {
                console.error('Error updating duration in the database:', error);
              });
            }
          })
          .catch((error) => {
            console.error('Error checking if post exists:', error);
          });
      }
    };}
  }, [countdown, db, currentUserId, props.id, props.durationInSeconds]);
  
  
  

  const formatDuration = (duration) => {
    const days = Math.floor(duration / 86400);
    const hours = Math.floor((duration % 86400) / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${days}d ${hours}h ${minutes}min ${seconds}sec`;
  };

  const handleClicked = () => {
    
    props.handleEdit(props.id);
  };


  return (
    <div>
      <div class="desk-my-post-card">
      <img
        class="desk-my-post-card-child"
        alt=""
        src="./public/rectangle-81.svg"
      />

      <img
      onClick={handleClicked}
        class="desk-my-post-navigation-card-o-icon"
        alt=""
        src="./public/desk-my-post-navigation-card-outer.svg"
      />

      <div class="desk-my-post-navigation-card-p">
        <img
          class="image-6-icon"
          alt=""
          src="./public/image-6@2x.png"
        />

        <img
          class="image-6-icon"
          alt=""
          src={props.imgURl}
        />
      </div>
      <div class="desk-my-post-navigation-card-t">
        <b class="angry-graffiti6">{props.channelName}</b>
        <b class="the-dark-night6">{props.tittle}</b>
      </div>
      <div class="desk-my-post-navigation-card-l">
        <div class="desk-home-carousal-main-live-d-child"></div>
        <div class="desk-home-carousal-main-live-d-item"></div>
        <div class="live-drop">{props.status}</div>
        <div class="ends-in-1d">{formatDuration(countdown)}</div>
      </div>
    </div>
    </div>
  )
}
