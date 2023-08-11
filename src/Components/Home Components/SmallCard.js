import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set ,get} from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function SmallCard(props) {
    const [countdown, setCountdown] = useState(props.durationInSeconds);
  const db = getDatabase();
 
  const currentUserId = props.channelId;

  const handlebuy=()=>{
    props.setChannelId(props.channelId);
    props.setPostId(props.id)
    props.setChannel("buyer");
 
  }
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
  return (
  
        <div class="desk-home-small-card1">
              <img
                class="desk-home-small-card-bitcoin-s-icon"
                alt=""
                src="./public/ethsymbol.svg"
              />

              <div class="desk-home-small-card-inner">
                <img
                  class="desk-home-small-card-inner-child"
                  alt=""
                  src="./public/rectangle-8.svg"
                />

                <div onClick={handlebuy} class="desk-home-small-card1-but-btn">
                  <div class="desk-home-small-card1-but-btn-child"></div>
                  <b class="buy">Mint</b>
                </div>
                <div class="desk-home-small-card-pic-frame">
                  <img
                    class="image-6-icon"
                    alt=""
                    src={props.imgURl}
                  />
                </div>
                <div class="desk-home-small-card-tittles">
                  <b class="angry-graffiti">{props.channelName}</b>
                  <b class="the-dark-night">{props.tittle}</b>
                </div>
                <div class="desk-home-small-card1-live-sta">
                  <div class="desk-home-carousal-main-live-d-child"></div>
                  <div class="desk-home-small-card-live-drop">
                    <div class="desk-home-small-card-live-drop-child"></div>
                    <div class="live-drop2">LIVE DROP</div>
                  </div>
                  <div class="ends-in-1d">{formatDuration(countdown)}</div>
                </div>
              </div>
            </div>
   
  )
}
