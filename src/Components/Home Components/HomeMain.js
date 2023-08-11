import React, { useRef, useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, remove, get, off } from 'firebase/database';
import CarousalMain from './CarousalMain'
import SmallCard from './SmallCard'
import PublisherCard from './PublisherCard';
import { getAuth } from 'firebase/auth';
import CardMain from './CardMain';
import Header from '../Header';
export default function HomeMain(props) {

  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsBig, setPostsBig] = useState([]);
  const [currentChannel, setCurrentChannel] = useState([]);
  const db = getDatabase();
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  // Function to shuffle an array randomly (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  useEffect(() => {
    const delay = 3000; // Delay in milliseconds (3 seconds)

    // Use setTimeout to delay the execution of fetchRandomChannel
    const timeoutId = setTimeout(() => {
      const fetchRandomChannel = async () => {
        try {
          const channelsRef = ref(db, 'Channels');
          const snapshot = await get(channelsRef);
          const channelsData = snapshot.val();

          const allChannels = [];
          if (channelsData == null) {
            return;
          }

          if (channelsData) {
            // Loop through all users (channels)
            Object.keys(channelsData).forEach((userId) => {
              const channel = { userId };
              const userPosts = channelsData[userId]?.posts;
              if (userPosts) {
                channel.posts = Object.values(userPosts);
              }

              // Fetch the channel profile data (channel name, description, price)
              const profileRef = ref(db, `Channels/${userId}/profile`);
              onValue(profileRef, (snapshot) => {
                const profileData = snapshot.val();
                if (profileData !== null) {
                  channel.channelName = profileData.channelName || "Default Channel Name";
                  // ... Rest of your profile data setup ...

                  allChannels.push(channel);
                }
              });
            });
          }

          const shuffledChannels = shuffleArray(allChannels);
          const randomChannel = shuffledChannels.length > 0 ? shuffledChannels[0] : null;

          setCurrentChannel(randomChannel);
        } catch (error) {
          console.error('Error fetching channels:', error);
        }
      };

      // Fetch a random channel initially
      fetchRandomChannel();

      // Fetch a new random channel every 10 seconds (adjust the interval as needed)
      const intervalId = setInterval(fetchRandomChannel, 10000);

      // Clear the interval on component unmount to avoid memory leaks
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId); // Clear the timeout when unmounting
      };
    }, delay);

    // Clear the timeout if the component unmounts before the delay is over
    return () => clearTimeout(timeoutId);
  }, [db]);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const channelsRef = ref(db, 'Channels');
        const snapshot = await get(channelsRef);
        const channelsData = snapshot.val();

        const allPosts = [];
        if (channelsData == null) {
          return;
        }

        if (channelsData) {
          // Loop through all users
          Object.keys(channelsData).forEach((userId) => {
            const userPosts = channelsData[userId]?.posts;
            if (userPosts) {
              // Loop through all posts of the user and add them to the allPosts array
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

        // Shuffle the array of posts randomly
        const shuffledPosts = shuffleArray(allPosts);

        // Display a limited number of random posts (e.g., 5)
        const numberOfRandomPosts = 6;
        const selectedPosts = shuffledPosts.slice(0, numberOfRandomPosts);

        setPosts(selectedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchRandomPosts();
  }, [db]);
  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const channelsRef = ref(db, 'Channels');
        const snapshot = await get(channelsRef);
        const channelsData = snapshot.val();

        const allPosts = [];
        if (channelsData == null) {
          return;
        }

        if (channelsData) {
          // Loop through all users
          Object.keys(channelsData).forEach((userId) => {
            const userPosts = channelsData[userId]?.posts;
            if (userPosts) {
              // Loop through all posts of the user and add them to the allPosts array
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

        // Shuffle the array of posts randomly
        const shuffledPosts = shuffleArray(allPosts);

        // Display a limited number of random posts (e.g., 5)
        const numberOfRandomPosts = 2;
        const selectedPosts = shuffledPosts.slice(0, numberOfRandomPosts);

        setPostsBig(selectedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchRandomPosts();
  }, [db]);


  return (
    <div>
      <img
        class="wepik-export-202307240755387fo-icon"
        alt=""
        src="./public/home_bg_imp (1).png"
      />

      <div class="desk-home-view">
        <img
          class="home-bg-imp-icon"
          alt=""
          src="./public/home-bg-imp@2x.png"
        />

        <div className="desk-home-carousal-main m-10">
          <div className="slider">
            {postsBig.map((post, index) => (
              <CardMain
              description={post.postDescription}
                price={post.netPrice}
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
                status={post.duration === 0 ? 'Expired' : 'Live'}
              />
            ))}



          </div>
        </div>



        <Header left={"50px"} />


        <div class="desk-home-featured-cards" style={{ left: "0px" }}>
          <b class="featured-live-drops">Featured Live Drops</b>
          {posts.map((post, index) => (
            <SmallCard
              price={post.netPrice}
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
              status={post.duration === 0 ? 'Expired' : 'Live'}
            />
          ))}
        </div>

        <PublisherCard
          top={"60.88rem"}
          channelName={currentChannel.channelName}
          img={currentChannel.img}
          decs={currentChannel.description}
          price={currentChannel.price}
          id={currentChannel.userId}
          setChannel={props.setChannel}
          setId={props.setId}
        />
        <div class="desk-home-welcome-board m-10">
          <b class="welcome-to-cryptors">Welcome to Cryptors</b>
          <div class="discover-the-extraordinary">
            Discover the extraordinary world of NFTs at Cryptors - the
            ultimate platform for buying, selling, and trading digital art.
            Unleash the potential of your digital masterpieces with seamless
            transactions using ETH, Bitcoin, and Rupees. Join us now to
            revolutionize the way you own and interact with unique digital
            assets.
          </div>
          <img
            class="cat-warriors-with-burning-eyes-icon"
            alt=""
            src="./public/catwarriorswithburningeyesgenerativeai-1@2x.png"
          />
        </div>
        <div class="desk-home-bottom-carusal m-10">
          <div class="desk-home-bottom-carusal-child"></div>
          <div class="desk-home-bottom-carusal-slide">
            <div class="why-cryptors">Why Cryptors?</div>
            <div class="it-is-the">
              It is the world’s first and largest digital marketplace for
              crypto collectibles and non-fungible tokens (NFTs). Buy, sell,
              and discover exclusive digital items.
            </div>
          </div>
          {/* <img
            class="desk-home-bottom-carusalleftbt-icon"
            alt=""
            src="./public/desk-home-bottom-carusalleftbtn.svg"
          />

          <img
            class="desk-home-bottom-carusal-right-icon"
            alt=""
            src="./public/desk-home-bottom-carusal-rightbtn.svg"
          /> */}
        </div>
        <div class="desk-home-footer m-10">
          <div class="desk-home-footer-child"></div>
          <img
            class="desk-home-footer-follw-icon"
            alt=""
            src="./public/desk-home-footer-follw.svg"
          />

          <div class="cryptors-networks-inc">
            © 2023 Cryptors Networks, Inc
          </div>


          <img
            class="desk-home-footer-logo-main"
            alt=""
            src="./public/vector.svg"
          />

          {/* <div class="desk-home-footer-contactus">
            <div class="desk-home-footer-contactus-child"></div>
            <img
              class="desk-home-footer-arrow-down-icon"
              alt=""
              src="./public/desk-home-footer-arrow-down.svg"
            />

            <div class="contact-us">Contact us</div>
            {/* <div class="cryptorstechgmailcom-91-container">
              <ul class="cryptorstechgmailcom-91">
                cryptorstech@gmail.com | +91 9752133459
              </ul>
            </div> */}
          {/* </div> */}
          <div class="desk-home-footer-contactus">
            <div class="desk-home-footer-aboutus-child"></div>
            <img
              class="desk-home-footer-arrow-icon"
              alt=""
              src="./public/desk-home-footer-arrow.svg"
            />

            <div class="contact-us">Contact us</div>
          </div>
          <div class="desk-home-footer-aboutus">
            <div class="desk-home-footer-aboutus-child"></div>
            <img
              class="desk-home-footer-arrow-icon"
              alt=""
              src="./public/desk-home-footer-arrow.svg"
            />

            <div class="about-cryptors">About Cryptors</div>
          </div>
          <div class="desk-home-footer-privacy-polic">
            <div class="desk-home-footer-privacy-polic-child"></div>
            <img
              class="desk-home-footer-arrow-icon1"
              alt=""
              src="./public/desk-home-footer-arrow.svg"
            />

            <div class="privacy-policy">Privacy Policy</div>
          </div>
          <div class="desk-home-footer-terms">
            <div class="desk-home-footer-terms-child"></div>
            <img
              class="desk-home-footer-arrow-icon2"
              alt=""
              src="./public/desk-home-footer-arrow.svg"
            />

            <div class="about-cryptors">Terms & Conditions</div>
          </div>
          <div class="desk-home-footer-desclimer">
            <div class="desk-home-footer-terms-child"></div>
            <img
              class="desk-home-footer-arrow-icon"
              alt=""
              src="./public/desk-home-footer-arrow.svg"
            />

            <div class="about-cryptors">Disclaimer</div>
          </div>
        </div>


      </div></div>


  )
}
