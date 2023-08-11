import React, { useRef, useState, useEffect } from 'react';

import { getDatabase, ref, onValue, set, remove, get } from 'firebase/database';

import { getAuth } from 'firebase/auth';

import Header from './Header';
import SmallCard from './Home Components/SmallCard';
import PublisherCard from './Home Components/PublisherCard';
export default function ChannelInterface(props) {
    const [channelname, setChannelName] = useState("create");
    const [ description, setDescription] = useState("create");
    const [price, setPrice] = useState("create");
    const [userName, setUserName] = useState("Guest")
    const [posts, setPosts] = useState([]);
    const [img, setimg] = useState("./public/vector-8@2x.png")
   
    const currentUserId = props.id;
    const db = getDatabase();
    const handleBuy=()=>{
}
    useEffect(() => {
      if (!currentUserId) {
        return;
      }
  
      const fetchPosts = async () => {
        try {
          const postsRef = ref(db, `Channels/${currentUserId}/posts`);
          const snapshot = await get(postsRef);
          const postsData = snapshot.val();
  
          const postsArray = postsData
            ? Object.entries(postsData).map(([id, data]) => ({ id, ...data }))
            : [];
  
          // Filter expired posts (durationInSeconds = 0)
          const expiredPosts = postsArray.filter((post) => post.duration!= 0);
  
          setPosts(expiredPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
  
    const postsRef = ref(db, `Channels/${currentUserId}/posts`);
      onValue(postsRef, (snapshot) => {
        const postsData = snapshot.val();
        const updatedPostsArray = postsData
          ? Object.entries(postsData).map(([id, data]) => ({ id, ...data }))
          : [];
  
        // Filter expired posts (durationInSeconds = 0)
        const expiredPosts = updatedPostsArray.filter((post) => post.duration != 0);
  
        setPosts(expiredPosts);
      });
      console.log(posts);
      fetchPosts();
    }, [currentUserId, db]);
   
    useEffect(() => {
      
      if (!currentUserId) {
        // User not logged in, set the default "Guest" name
        setUserName("Guest");
        return;
      }
      const db = getDatabase();
      const userNodeRef = ref(db, 'Channels/' + currentUserId + '/profile/name');
      onValue(userNodeRef, (snapshot) => {
        const name = snapshot.val();
        setUserName(name || "Guest");
      });
      const userNodeRef2 = ref(db, 'Channels/' + currentUserId + '/profile/channelName');
      onValue(userNodeRef2, (snapshot) => {
        const name = snapshot.val();
        if (name != null) {
          setChannelName(name);
        }
        return;
      });
      const userNodeRef3 = ref(db, 'Channels/' + currentUserId + '/profile/backgroundImage');
      onValue(userNodeRef3, (snapshot) => {
        const name = snapshot.val();
        if (name != null) {
          setimg(name);
        }
        return;
      });
      const userNodeRef4 = ref(db, 'Channels/' + currentUserId + '/profile/startingPrice');
      onValue(userNodeRef4, (snapshot) => {
        const name = snapshot.val();
        if (name != null) {
          setPrice(name);
        }
        return;
      });
      const userNodeRef5 = ref(db, `Channels/${currentUserId}/profile/description`);
      onValue(userNodeRef5, (snapshot) => {
        const name = snapshot.val();
        if (name != null) {
          // Limit the description to 12 words and add "..." if it's longer
          const truncatedDescription = name
            .split(' ')
            .slice(0, 8)
            .join(' ');
          setDescription(truncatedDescription+" . . . ");
        }
      });
  
    }, []);

  return (
    <div>
      <div>
      
      
      <img
            class="home-bg-imp-iconch"
            alt=""
            src="./public/home-bg-imp@2x.png"
          />
         
         <Header channelname={channelname} userName={userName}/>
         <div className='channelinside'>
     
         
         <PublisherCard top={"7rem"} channelName = {channelname}img ={img} decs={description} price={price} id={""}
         /> 
          
            
            <div class="desk-home-featured-cards  p-20">
            <b class="featured-live-drops">Featured Live Drops</b>
            {posts.map((post, index) => (
          <SmallCard
            
            key={index}
            imgURl={post.postImage}
            tittle={post.tittle}
            durationInSeconds={post.durationInSeconds}
            channelName={channelname}
            id={post.id}
            buy={handleBuy}
            status={post.duration === 0 ? 'Expired' : 'Live'}
          />
        ))}
           
          </div>
        
         
         
         

       
        </div></div></div>
  
  )
}
