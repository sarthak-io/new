import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getDatabase, ref, onValue, set, remove, get } from 'firebase/database';
import PostCard from './PostCard';
import { getAuth } from 'firebase/auth';

export default function Expired(props) {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [channelName, setChannel] = useState('');
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  const db = getDatabase();

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

    const userNodeRef2 = ref(db, 'Channels/' + currentUserId + '/profile/channelName');
    onValue(userNodeRef2, (snapshot) => {
      const name = snapshot.val();
      if (name != null) {
        setChannel(name);
      }
    });

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

  const btnnext = () => {
    if (containerRef.current) {
      let width = containerRef.current.clientWidth;
      containerRef.current.scrollLeft = containerRef.current.scrollLeft + width;
    }
  };

  return (
    <div>
      <img onClick={btnnext} className="vector-icon3" alt="" src="./public/vector3.svg" />
      <div ref={containerRef} className="desk-my-post-bodymain-content">
        {posts.map((post, index) => (
          <PostCard
            handleEdit={props.handleEdit}
            key={index}
            imgURl={post.postImage}
            tittle={post.tittle}
            durationInSeconds={post.durationInSeconds}
            channelName={channelName}
            id={post.id}
            status={post.duration === 0 ? 'Expired' : 'Live'}
          />
        ))}
      </div>
    </div>
  );
}
