import React, { useEffect, useState } from 'react'
import app from './Firebase/Firebase';
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, onValue, set, off } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Channel from './Channel';
import { connectWallet } from '../Blockchain.Services';
import { useGlobalState, setGlobalState } from '../store';
import { create } from 'ipfs-http-client'
import { mintNFT } from '../Blockchain.Services'
import axios from 'axios';



const jwt = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZWUyZmYyNy1mMmZiLTQwM2EtOTk4ZS1mN2NhZGMwYzZmYTgiLCJlbWFpbCI6InNhcnRoYWsyNWljMDQ5QHNhdGllbmdnLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjNiOTcyYTE4OWY0Y2IwZWJiMGJmIiwic2NvcGVkS2V5U2VjcmV0IjoiZGFlZjdhY2U3ZjUzYTVhN2ZkZmQzMjgxZDQ2YmMwMzZhOTUzOWZhMzc5NDJiNGI3ODBjNjg5ZGM2MjY1OTZlOCIsImlhdCI6MTY5MTc1MTA2MH0.n4E2FvHtnFf_Dkxg2pYj2Va3l-McdvYCUPYESz8jitQ`;







export default function Setting(props) {

  const [userName, setUserName] = useState("Guest")


  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  const [isMetaMaskConnected] = useGlobalState("connectedAccount");
  const [showPopup] = useGlobalState("connectedAccount");
  const channel = useGlobalState("channel");

  const [imageUrl, setImageUrl] = useState('./public/download-4-1@2x.png');
  const [fileNames, setFileNames] = useState({
    backgroundImage: "",
    termsConditions: "",
    previouslySold: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgBase64, setImgBase64] = useState(null);


  // Create a state hook for the form data as an object
  const [formData, setFormData] = useState({
    tittle: "",
    category: "",
    Image: "",
    termsChecked: false,
    price: "",
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
  const tittle = formData.tittle;
  const description = formData.description;
  const price = formData.price;
  


  const [urlUpload, setUrlUpload] = useState('./public/download-4-1@2x.png');
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setUrlUpload(imageUrl);
    }
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // If the input is a file, store the selected file and its name in the state
    if (type === 'file') {
      const file = e.target.files[0];
      handleImageUpload(e);
      changeImage(e);
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

  const handleSubmitNft = async (e) => {
  

    if (!tittle || !price || !description || !selectedFile) return;


    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const metadata = JSON.stringify({
        name: tittle,
        description,
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      console.log('Uploading to Pinata...');
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: jwt,
          },
        }
      );

      const metadataURI = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const nft = { tittle, price, description, metadataURI };

      console.log('Initializing transaction...');
      const txHash = await mintNFT(nft); // Capture the transaction hash
      console.log('Transaction Hash:', txHash);

     
      console.log('Minting completed...', 'green');
      // window.location.reload();
    } catch (error) {
      console.error('Error uploading file or minting NFT:', error);
      console.log('Minting failed...', 'red');
    }
  };

  const changeImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
      setSelectedFile(e.target.files[0]); // Update selectedFile state
    };
  };

 





  const handleSubmit = () => {
    handleSubmitNft();
    if (!currentUserId && !isMetaMaskConnected) {
      toast.error("Please Add Metamask!!");
      return;
    }

    // Create a function to upload files to Firebase Storage
    const uploadFilesToStorage = async () => {
      const storage = getStorage();
      const filesToUpload = ['Image'];

      const uploadPromises = filesToUpload.map(async (field) => {
        const file = formData[field];
        if (file) {
          try {
            const storageRefPath = `channels/${currentUserId}/${field}`;
            const snapshot = await uploadBytes(storageRef(storage, storageRefPath), file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            Image = downloadURL;
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
        const userNodeRef = ref(db, 'Channels/' + currentUserId + '/createdNFTs');

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
    <div> <div class='desk-create'>
      <img
        class="desk-main-bg-icon"
        alt=""
        src="./public/desk-main-bg@2x.png"
      />
      <img style={{ cursor: "pointer" }} className={`vector-icon4-h${showPopup ? '  show' : ' hide'}`} alt="" src="./public/vector4.svg" />
      <div class="desk-my-post-view">

        <div class="desk-create-profile">
          <b class="dev-jadiya">{userName}</b>
          <div class="channel-name">Channel name</div>
          <img
            class="desk-my-post-navigation-card-o-icon"
            alt=""
            src="./public/desk-create-profilepic.svg"
          />

        </div>


        <div class="desk-create-view-child"></div>
        <div class="create-channel">Mint Your Nft</div>
        <div class="desk-create-innercontent">
          <div class="desk-create-channel-name">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />
            <input type='text' name='tittle'
              value={formData.tittle}
              placeholder='Tittle'
              onChange={handleChange} className='input 1'></input>

            <img class="bulb-icon" alt="" src="./public/ideabulb.svg" />
          </div>
          <div class="desk-my-post-bodymain-content211" style={{ left: "0px", width: "19.5rem", height: "14rem", borderRadius: "20px", top: "10rem" }}>
            <img
              class="download-4-1"
              alt=""
              src={urlUpload}
              style={{ width: "100%", height: "100%" }}
            />
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
            <input type='number' value={formData.price}
              name='price'
              onChange={handleChange} placeholder='Price' className='input 1'></input>

          </div>

          <div class="desk-create-bg">
            <img
              class="desk-create-channel-name-child"
              alt=""
              src="./public/rectangle-242.svg"
            />

            <input type='file' style={{ display: "none" }} id='fileInputimg'
              name='Image'
              onChange={handleChange} />
            <div className='i1'><label className='label' htmlFor='fileInputimg' >
              {fileNames.Image || "NFT image"}
            </label></div>

            <img
              class="desk-create-downarrow-icon"
              alt=""
              src="./public/desk-my-post-bodymain-content-arrowdown.svg"
            />
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

    </div>
  )
}
