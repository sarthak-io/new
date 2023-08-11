import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set ,get} from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function CardMain(props) {
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
    <div>
         <div class="desk-home-carousal-main1">
              <div class="desk-home-carousal-main1-child"></div>
              <img
                class="desk-home-carousal-main1-frame-icon"
                alt=""
                src={props.imgURl}
              />

              <div class="desk-home-carousal-main1-tittl">
                <b class="the-epic-of">{props.tittle}</b>
              </div>
              <img
                class="desk-home-carousal-main1-borde-icon"
                alt=""
                src="./public/desk-home-carousal-main1-border.svg"
              />

              <div class="desk-home-carousal-main-price">
                <b class="eth">{props.price}ETH</b>
              </div>
              <div class="desk-home-carousal-main-live-d">
                <div class="desk-home-carousal-main-live-d-child"></div>
                <div class="desk-home-carousal-main-live-d-item"></div>
                <div class="live-drop">LIVE DROP</div>
                <div class="ends-in-1d">Ends in {formatDuration(countdown)}</div>
              </div>
              <div class="desk-home-carousal-main-descri">
                <div class="a-series-of">
                  {props.description}
                </div>
              </div>
              <div onClick={handlebuy} class="desk-home-carousal-main-buy-bt">
                <div class="desk-home-carousal-main-buy-bt-child"></div>
                <div class="buy-now">Buy now</div>
              </div>
            </div>
    </div>
  )
}
