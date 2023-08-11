import React, { useEffect, useState } from 'react'
import app from './Firebase/Firebase';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { useGlobalState ,truncate} from '../store';



export default function Header(props) {
  const [channelname, setChannel] = useState("create");
  const [userName, setUserName] = useState("Guest")
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  const [connectedAccount] = useGlobalState('connectedAccount')

 
    
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
        setChannel(name);
      }
      return;
    });

  }, []);

  return (
    <div><div style={{left:props.left}} class="desk-all-section-top-header">
    <div class="desk-user-profile-metadata">
      <b class="dev-jadiya">{userName}</b>
      <div style={{marginLeft:"5px" , textAlign:"start"}} class="angry-graffiti9">{channelname}</div>
     

      <img
      style={{borderRadius:"50%"}}
        class="desk-my-post-navigation-card-o-icon"
        alt=""
        src="./public/28682908.png"
      />
    </div>
    <img  style={{cursor:"pointer"}} class="vector-icon4" alt="" src="./public/vector4.svg" />

    <div class="desk-wallet-info-card3">
      <div class="rect-design">
        <div class="rect-design">
          <div class="rect-design-child"></div>
          <img
            class="rect-design-item"
            alt=""
            src="./public/vector-11.svg"
          />
        </div>
        <div class="total-earning">Address</div>
        <b class="eth3" style={{left:"20px"}}>{truncate(connectedAccount, 4, 4, 11)}</b>
      </div>
      <div class="desk-wallet-info-card11">
        <div class="rect-design">
          <div class="rect-design-child"></div>
          <img
            class="rect-design-item"
            alt=""
            src="./public/vector-11.svg"
          />
        </div>
        <div class="total-sold-nft">Total sold NFT</div>
        <div class="div">10/100</div>
      </div>
    </div>
  </div></div>
  )
}
