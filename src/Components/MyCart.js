import React, { useRef, useState, useEffect } from 'react';

import { getDatabase, ref, onValue, set, remove, get } from 'firebase/database';
import Header from './Header'
import CartCard from './CartCard';
export default function MyCart(props) {
  const [posts, setPosts] = useState([]);
  const [currentChannel, setCurrentChannel] = useState([]);
  const db = getDatabase();

 // Function to shuffle an array randomly (Fisher-Yates algorithm)
 const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


useEffect(() => {
  const fetchRandomPosts = async () => {
    try {
      const channelsRef = ref(db, 'Channels');
      const snapshot = await get(channelsRef);
      const channelsData = snapshot.val();

      const allPosts = [];

      if (channelsData) {
        Object.keys(channelsData).forEach((userId) => {
          const userPosts = channelsData[userId]?.posts;
          if (userPosts) {
            Object.keys(userPosts).forEach((postId) => {
              const post = { id: postId, ...userPosts[postId] };
              // Fetch the channel name associated with this post
              post.uid = userId;
              const channelNameRef = ref(db, `Channels/${userId}/profile/channelName`);
              onValue(channelNameRef, (snapshot) => {
                const channelName = snapshot.val();
                post.channelName = channelName;
              });
              allPosts.push(post);
            });
          }
        });
      }

      // Sort the posts based on netPrice in descending order
      const sortedPosts = allPosts.sort((a, b) => b.netPrice - a.netPrice);

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  fetchRandomPosts();
}, [db]);
  return (
    <div>
      <Header/><div class="desk-desk-cart">
      <img
        class="desk-main-bg-icon"
        alt=""
        src="./public/desk-main-bg@2x.png"
      />
    <div class="desk-buy-view">
  

      <div class="desk-buy-card">
        <div class="desk-buy-card-child"></div>
        <div class="desk-table-ietms">
          <div class="channel3">Channel</div>
          <div class="nft-tag1">NFT tag</div>
          <div class="price">Price</div>
          <div class="status">Status</div>
          <div class="edit">#</div>
          <div class="desk-table-ietms-child"></div>
        </div>
<div className='tableitems'>
        {posts.map((post, index) => (
          <CartCard
            key={index}
            imgURl={post.postImage}
            tittle={post.tittle}
            durationInSeconds={post.durationInSeconds}
            channelName={post.channelName}
            id={post.id}
            channelId={post.uid}
            setChannelId={props.setChannelId}
            setPostId={props.setPostId}
            setChannel={props.setChannel}
            price= {post.netPrice}
            status={post.duration === 0 ? 'Expired' : 'Live'}
          />
        ))}
       </div> 
  </div></div>
  </div></div>
  )
}
