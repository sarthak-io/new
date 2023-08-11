import React, { useEffect, useState } from 'react'
import app from './Firebase/Firebase';
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, onValue, set ,off} from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Channel from './Channel';
import { connectWallet } from '../Blockchain.Services';
import { useGlobalState } from '../store';
import { isWallectConnected } from '../Blockchain.Services';


export default function MyChannel(props) {
  // const [channel, setChannel] = useState("create");
  const [userName, setUserName] = useState("Guest")
  // const [showPopup, setShowPopup] = useState(false);
  // const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
const [isMetaMaskConnected] = useGlobalState("connectedAccount");
const [showPopup] = useGlobalState("connectedAccount");
const channel = useGlobalState("channel");
const [active,setActive] =useState("my");
 
  const [fileNames, setFileNames] = useState({
    backgroundImage: "",
    termsConditions: "",
    previouslySold: "",
  });
  
  
  useEffect(()=>{
  if(channel && currentUserId!=null && isMetaMaskConnected)
  {
    setActive("channel")
  }
  else if(!channel || !isMetaMaskConnected )
  {
    setActive("my");
  }
  else if(!isMetaMaskConnected &&channel){
    setActive("meta")
  }
  })
  


  

  // Create a state hook for the form data as an object
  const [formData, setFormData] = useState({
    channelName: "",
    category: "",
    startingPrice: "",
    blockchainType: "",
    backgroundImage: "",
    termsChecked: false,
    termsConditions: "",
    previouslySold: "",
    description: `Metadata is additional information about the NFT, such as its
     title, description, and any other relevant details. This
     information helps potential buyers understand the value and
     characteristics of the NFT.Metadata is additional information
     about the NFT, such as its title, description, and any other
     relevant details. This information helps potential buyers
     understand the value and characteristics of the NFT.Metadata is
     additional information about the NFT, such as its title,
     description, and any other relevant details. Metadata is
     additional information about the NFT, such as its title,
     description, and any other relevant details. This information
     helps potential buyers understand the value and characteristics
     of the NFT.Metadata is additional information about the NFT,
     such as its title, description, and any other relevant details.
     This information helps potential buyers understand the value and
     characteristics of the NFT.Metadata is additional information
     about the NFT, such as its title, description, and any other
     relevant details.`,
  });
 
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // If the input is a file, store the selected file and its name in the state
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [name]: file.name, // Store the selected file name
      }));
    } else {
      // For other input types, use the regular value
      const fieldValue = type === 'checkbox' ? e.target.checked : value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fieldValue,
      }));
    }
  };



  


  const handleSubmit = () => {
    if (!currentUserId && !isMetaMaskConnected ) {
      toast.error("Please Add Metamask!!");
      toast.error("Login in your account!!");
      return;
    }
    if (channel) {
      toast.error("Already have a channel!");
      
      return;
    }

    // Create a function to upload files to Firebase Storage
    const uploadFilesToStorage = async () => {
      const storage = getStorage();
      const filesToUpload = ['backgroundImage', 'termsConditions', 'previouslySold'];

      const uploadPromises = filesToUpload.map(async (field) => {
        const file = formData[field];
        if (file) {
          try {
            const storageRefPath = `channels/${currentUserId}/${field}`;
            const snapshot = await uploadBytes(storageRef(storage, storageRefPath), file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return { [field]: downloadURL };
          } catch (error) {
            console.error(`Error uploading ${field}:`, error);
          }
        }
        return { [field]: null };
      });

      return Promise.all(uploadPromises);
    };

    // Call the function to upload files to Firebase Storage
    uploadFilesToStorage()
      .then((uploadedFiles) => {
        // Merge the uploaded file URLs into the formData
        const updatedFormData = { ...formData };
        uploadedFiles.forEach((file) => {
          const [fieldName, fieldValue] = Object.entries(file)[0];
          if (fieldValue) {
            updatedFormData[fieldName] = fieldValue;
          }
        });
        // Add the 'name' field back to the formData
        updatedFormData.name = userName;

        // Save the data to the database
        const db = getDatabase();
        const userNodeRef = ref(db, 'Channels/' + currentUserId + '/profile');

        // Set the data to the database node
        set(userNodeRef, updatedFormData)
          .then(() => {
            console.log("Data saved to the database successfully!");
            // You can perform any other actions here after successful data submission.
          })
          .catch((error) => {
            console.error("Error saving data:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };
  
 


return (
    <div> {active =="my" &&<div class='desk-create'>
      <img
        class="desk-main-bg-icon"
        alt=""
        src="./public/desk-main-bg@2x.png"
      />
      <img style={{ cursor: "pointer" }} className={`vector-icon4-h${showPopup ? '  show' : ' hide'}`} alt="" src="./public/vector4.svg" />
      <div class="desk-my-post-view">

        <div class="desk-create-profile">
          <b class="dev-jadiya">{userName}</b>
          <div class="channel-name">Channel name {userBalance}</div>
          <img
            class="desk-my-post-navigation-card-o-icon"
            alt=""
            src="./public/desk-create-profilepic.svg"
          />

        </div>
        

        <div class="desk-create-view-child"></div>
        <div class="create-channel">Create Channel</div>
        <div class="desk-create-innercontent">
          <div class="desk-create-channel-name">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />
            <input type='text' name='channelName'
              value={formData.channelName}
              placeholder='Channel name'
              onChange={handleChange} className='input 1'></input>

            <img class="bulb-icon" alt="" src="./public/ideabulb.svg" />
          </div>
          <div class="desk-create-category">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />

            <img
              class="desk-create-downarrow-icon"
              alt=""
              src="./public/desk-my-post-bodymain-content-arrowdown.svg"
            />
            <input type='text' value={formData.category}
              name='category'
              onChange={handleChange} placeholder='Category' className='input 1'></input>

          </div>
          <div class="desk-create-starting-price">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />
            <input type='text' value={formData.startingPrice}
              name='startingPrice'
              onChange={handleChange} placeholder='Starting Price' className='input 1'></input>

            <img
              class="desk-create-etcicon"
              alt=""
              src="./public/desk-my-post-bodymain-content-etcicon.svg"
            />
          </div>
          <div class="desk-create-blockcahin">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />
            <input type='text' value={formData.blockchainType}
              name='blockchainType'
              onChange={handleChange} placeholder='Blockchain Type' className='input 1'></input>

            <img class="desk-create-downarrow-icon"
              alt=""
              src="./public/desk-my-post-bodymain-content-arrowdown.svg" />


          </div>
          <div class="desk-create-bg">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />

            <input type='file' style={{ display: "none" }} id='fileInputimg'
              name='backgroundImage'
              onChange={handleChange} />
            <div className='i1'><label className='label' htmlFor='fileInputimg' >
              {fileNames.backgroundImage || "Background image"}
            </label></div>

            <img
              class="desk-create-downarrow-icon"
              alt=""
              src="./public/desk-my-post-bodymain-content-arrowdown.svg"
            />
          </div>
          <div class="desk-create-termscondition">



            <div onClick={connectWallet} className='i5'><label className='label' htmlFor='fileInputterms' >
              {isMetaMaskConnected || showPopup? "Connected ":"Add MetaMask"  }
            </label></div>
            <img
              
              style={{
                zIndex:"100",
                left: "68.66%",
                height: "65%",
                top: "18.3%",
                width: "8%"
              }}
              class="desk-create-downarrow-icon"
              alt=""
              src="./public/vector4.svg"
            />
          </div>
          <div class="desk-create-previoulysold">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />
            <input type='file' style={{ display: "none" }} id='fileInput'
              name='previouslySold'
              onChange={handleChange} />
            <div className='i1'><label className='label' htmlFor='fileInput' >
              {fileNames.previouslySold || "Previously sold (optional)"}
            </label></div>


            <img class="bulb-icon" alt="" src="./public/ideabulb.svg" />
          </div>
          <div class="desk-create-description">
            {/* <img
            class="desk-create-description-child"
            alt=""
            src="./public/rectangle-261.svg"
          /> */}

            <div class="desk-create-channeldescription">
              <div class="channel-description">Channel Description</div>
              <div class="desk-create-channeldescription-child"></div>
            </div>
            <textarea
              className='desk-create-description-child'
              rows='8'
              wrap='soft'
              value={formData.description}
              name='description'
              onChange={handleChange}
              placeholder='Enter your description here...'
              style={{ resize: 'vertical', maxWidth: '700px' }} // Add custom styles as needed
            />
          </div>
        </div>
        <div onClick={handleSubmit} class="desk-create-submit-btn">
          <div class="desk-create-submit-btn-child"></div>
          <b class="submit">Submit</b>
        </div>
        <div class="desk-create-terms">
          <input class="desk-create-terms-child" type='checkbox' name="termsChecked"
            checked={formData.termsChecked}
            onChange={handleChange}></input>

          <div class="terms-conditions1">Terms & Conditions</div>
        </div>
        <ToastContainer />
      
      </div>

    </div>
        
      }{ active ==="channel" && <Channel />}
        {
        active ==="meta" && <div style={{ textAlign:"center" , width:"85%", height:"100vh",position:"absolute",top:"0%",left:"10%"}}> <img
        class="desk-main-bg-icon"
        alt=""
        src="./public/desk-main-bg@2x.png"
      /><button className='con' onClick={connectWallet}>Add Meta Mask</button></div>
      }
      </div>
  )
}
