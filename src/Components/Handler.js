import React, { useState ,useEffect} from 'react'
import HomeMain from './Home Components/HomeMain'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set, remove, get ,off} from 'firebase/database';
import MyPostMain from './My Post/MyPostMain';
import MyChannel from './MyChannel';
import MyCart from './MyCart'
import Setting from './Setting'
import SiderbarNavigation from './SiderbarNavigation';
import Login from './Preloader/Login'
import Signup from './Preloader/Signup';
import ChannelInterface from './ChannelInterface';
import Buyer from './Buyer'


export default function Handler() {
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
    const[active,setActive]=useState("Home");
    const[login,setLogin]=useState("signup");
    const[id,setId]=useState("");
    const[channelId,setChannelId]=useState("");
    const[postId,setPostID]=useState("");
    const[adddressMeta,setAddressMeta]=useState("");

    const auth = getAuth();
    const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  //   useEffect(() => {
  //     const checkEthereumBalance = async () => {
  //       const { ethereum } = window;
  //       if (ethereum && ethereum.isMetaMask) {
  //         try {
  //           const accounts = await ethereum.request({ method: 'eth_accounts' });
  //           if (accounts.length > 0) {
  //             const balanceWei = await ethereum.request({
  //               method: 'eth_getBalance',
  //               params: [accounts[0], 'latest'],
  //             });
  //             const balanceEther = formatEther(balanceWei);
  //             const balanceEtherFormatted = parseFloat(balanceEther).toFixed(4);
  // setUserBalance(balanceEtherFormatted);
              
    
  //             const minBalanceThreshold = 0.01;
  //             const isConnected = parseFloat(balanceEther) >= minBalanceThreshold;
  //             setIsMetaMaskConnected(isConnected);
              
  //             // // Move the rest of your code that depends on isMetaMaskConnected here
  //             // if (isConnected) {
  //             //   const db = getDatabase();
  //             //   const userNodeRef = ref(db, 'Channels/' + currentUserId + '/profile/name');
  //             //   onValue(userNodeRef, (snapshot) => {
  //             //     const name = snapshot.val();
  //             //     setUserName(name || "Guest");
  //             //   });
    
  //             //   const userNodeRef6 = ref(db, 'Channels/' + currentUserId + '/profile/publicId');
  //             //   onValue(userNodeRef6, (snapshot) => {
  //             //     const name = snapshot.val();
  //             //     if (name != "") {
  //             //       setShowPopup(true);
  //             //     }
  //             //   });
    
  //             //   const userNodeRef2 = ref(db, 'Channels/' + currentUserId + '/profile/channelName');
  //             //   onValue(userNodeRef2, (snapshot) => {
  //             //     const name = snapshot.val();
  //             //     if (name != null) {
  //             //       setChannel("current");
  //             //     }
  //             //   });
  //             // }
  //           } else {
  //             setIsMetaMaskConnected(false);
  //           }
  //         } catch (error) {
  //           console.error('Error checking Ethereum balance:', error);
  //           setIsMetaMaskConnected(false);
  //         }
  //       } else {
  //         setIsMetaMaskConnected(false);
  //       }
  //     };
    
  //     checkEthereumBalance();
  
  //     return () => {
  //       const db = getDatabase();
  //       const userNodeRef6 = ref(db, 'Channels/' + currentUserId + '/profile/publicId');
  //       off(userNodeRef6, 'value'); // Remove the listener when unmounting or when disconnected
  //     };
  //   }, [isMetaMaskConnected]);
  
    // Check if the user is already logged in on component mount
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is logged in, set the active state to "All"
          setLogin("All");
        } else {
          // User is not logged in, keep the active state as "login" (or your default state)
          setLogin("signup");
        }
      });
  
      // Unsubscribe the listener on component unmount
      return () => unsubscribe();
    }, [auth]);
  return (
    <div style={{background:"#0a1223"}}>

{
    login==="All"&& <>
     <SiderbarNavigation active={active} setActive={setActive} setLogin={setLogin}/>
        {
            active ==="Home" && <><HomeMain setChannel={setActive} setId={setId} setChannelId={setChannelId} setPostId={setPostID}/></>
        }
         {
            active ==="Mypost" && <><MyPostMain balance={userBalance} address={adddressMeta}/></>
        }
         {
            active ==="Mychannel" && <><MyChannel setAddressMeta={setAddressMeta}/></>
        }
         {
            active ==="Cart" && <><MyCart setChannel={setActive} setId={setId} setChannelId={setChannelId} setPostId={setPostID}/></>
        }
         {
            active ==="Setting" && <><Setting/></>
        }
          {
            active ==="active" && <><ChannelInterface  id={id}/></>
        }
        {
            active ==="buyer" && <><Buyer  channel={channelId} post={postId}/></>
        }
       </>
}
{
    login=="login"&& <Login setLogin={setLogin}/>
}
{
    login=="signup"&& <Signup setLogin={setLogin}/>
}
       

    </div>
  )
}
