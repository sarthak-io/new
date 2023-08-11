import { useEffect } from 'react';
import './App.css';
import Handler from './Components/Handler';

import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set, off } from 'firebase/database';
import { setGlobalState } from './store';
import { getAllNFTs, isWallectConnected } from './Blockchain.Services';


function App() {
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;


  const channelINfo = () => {
    const db = getDatabase();
    const userNodeRef2 = ref(db, 'Channels/' + currentUserId + '/profile/channelName');
    onValue(userNodeRef2, (snapshot) => {
      const name = snapshot.val();
      if (name != null) {
        setGlobalState("channel", true);
      }
    })
  }
  useEffect(() => {
    if (currentUserId != null) {
      channelINfo();
    }
    const checkWalletConnection = async () => {
      await isWallectConnected();
      // await getAllNFTs();
    };
     checkWalletConnection();

  }, []);

  return (
    <>
      <div class="cryptors">
        <Handler />

      </div>







    </>
  );
}

export default App;
