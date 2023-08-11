import React, { useRef, useState, useEffect } from 'react';

import { getDatabase, ref, onValue, set, remove, get } from 'firebase/database';
import Header from './Header'
export default function Buyer(props) {
  const [currentPost, setCurrentPost] = useState([]);
  const [countdown, setCountdown] = useState("");
  const db = getDatabase();
  const selectedChannelUid = props.channel;
  const selectedPost = props.post;
  const currentUserId = props.channel;
  

  useEffect(() => {
    const fetchSelectedPost = async () => {
      try {
        const channelsRef = ref(db, 'Channels');
        const snapshot = await get(channelsRef);
        const channelsData = snapshot.val();

        let selectedPostData = null;

        if (channelsData) {
          Object.keys(channelsData).forEach((userId) => {
            const userPosts = channelsData[userId]?.posts;
            if (userPosts) {
              Object.keys(userPosts).forEach((postId) => {
                if (postId === selectedPost && userId === selectedChannelUid) {
                  const post = { id: postId, ...userPosts[postId] };
                  const channelNameRef = ref(db, `Channels/${userId}/profile/channelName`);
                  onValue(channelNameRef, (snapshot) => {
                    const channelName = snapshot.val();
                    post.channelName = channelName;
                  });
                  setCountdown(post.durationInSeconds);
                  selectedPostData = post;
                }
              });
            }
          });
        }

        setCurrentPost(selectedPostData);
        console.log(selectedPostData)
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchSelectedPost();
  }, [db, selectedChannelUid, selectedPost]);
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
  }, [countdown, db, currentUserId, props.id, currentPost.durationInSeconds]);
  
  
  

  const formatDuration = (duration) => {
    const days = Math.floor(duration / 86400);
    const hours = Math.floor((duration % 86400) / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${days}d ${hours}h ${minutes}min ${seconds}sec`;
  };
  return (
    <div>
      <Header/>
    <div class="desk-buy-view">
      <div class="desk-buy-card">
        <div class="desk-buy-card-child"></div>
        <div  class="desk-buy-card-btn">
          <div class="desk-buy-card-btn-child"></div>
          <b class="buy-now2">Mint</b>
        </div>
        <div class="desk-buy-card-img">
          <img
            class="image-15-icon"
            alt=""
            src={currentPost.postImage}
          />
        </div>
        <div class="desk-buy-card-header">
          <div class="desk-buy-card-header-child"></div>
          <div class="desk-buy-card-post-name">{currentPost.tittle}</div>
          <div class="desk-buy-card-channel">{currentPost.channelName}</div>
        </div>
        <div class="desk-buy-card-live-drop">
          <div class="desk-buy-card-live-drop-child"></div>
          <div class="desk-buy-card-live-drop-item"></div>
          <div class="live-drop">Live</div>
          <div class="ends-in-1d11">{formatDuration(countdown)}</div>
        </div>
        <div class="desk-buy-card-desciption">
        {currentPost.postDescription}
        </div>
        <div class="desk-buy-card-price">
          <div class="desk-buy-card-price-child"></div>
          <div class="eth5">{currentPost.netPrice}ETH</div>
          <img
            class="desk-buy-card-eth-icon"
            alt=""
            src="./public/desk-buy-card-eth.svg"
          />
        </div>
        <div class="desk-buy-card-terms">
          <img
            class="desk-buy-card-terms-child"
            alt=""
            src="./public/rectangle-243.svg"
          />

          <div class="terms-conditions4">Terms & Conditions</div>
          <img
            class="desk-buy-card-downarrow-icon"
            alt=""
            src="./public/desk-buy-card-downarrow.svg"
          />
        </div>
      </div>
    </div>
  </div>
  )
}
