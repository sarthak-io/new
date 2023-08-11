import React, { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function New() {
  const imageUrl = './public/rectangle-26.svg';
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  const [postCount, setPostCount] = useState(0);
  const [isValidNFT, setIsValidNFT] = useState(true); // State to track NFT validation
   // Create a state hook for the form data as an object
   const [formData, setFormData] = useState({
    tittle: "",
    tokenid: "",
    netPrice: "",
    postImage: "",
    termsChecked: false,
    startnow: "",
    postTag: "",
    duration: 0,
    description: `Metadata is additional information about the NFT, such as its    title, description, and any other relevant details. This    information helps potential buyers understand the value and    characteristics of the NFT.Metadata is additional information    about the NFT, such as its title, description, and any other    relevant details. This information helps potential buyers    understand the value and characteristics of the NFT.Metadata is    additional information about the NFT, such as its title,    description, and any other relevant details.`,
  });

  const handleVerifyNFT = async () => {
    // try {
    //   const contractAddress = '0x849278B1BD401a2574483C4Cf7B5F95bD0BA8A31';
  
    //   if (window.ethereum) {
    //     const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = web3Provider.getSigner();
        
    //     const contract = new ethers.Contract(contractAddress, NFTContractABI.abi, signer);
  
    //     const tokenId = formData.tokenid;
    //     const owner = await contract.ownerOf(parseInt(tokenId));
  
    //     const currentAddress = await signer.getAddress();
    //     const isOwnedByUser = owner === currentAddress;
    //     console.log(tokenId, currentAddress,owner);
    //     setIsValidNFT(isOwnedByUser);
        
    //   } else {
    //     console.log("MetaMask not installed; cannot proceed with verification");
    //   }
    // } catch (error) {
    //   console.error('Error verifying NFT:', error);
    // }
  };
  
  

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
      handleImageUpload(e);
      const file = e.target.files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
    } else if (name === 'duration') {
      // If the input is the "duration" field, parse the duration input
      const durationRegex = /(\d+d)?\s?(\d+h)?\s?(\d+min)?\s?(\d+sec)?/i;
      const matches = value.match(durationRegex);
      let totalSeconds = 0;

      if (matches) {
        const days = parseInt(matches[1]) || 0;
        const hours = parseInt(matches[2]) || 0;
        const minutes = parseInt(matches[3]) || 0;
        const seconds = parseInt(matches[4]) || 0;

        totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        durationInSeconds: totalSeconds, // Store the duration in seconds separately
      }));
    } else {
      // For other input types, use the regular value
      const fieldValue = type === 'checkbox' ? e.target.checked : value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fieldValue,
      }));

      console.log(formData);
    }
  };

  const handleSubmit = () => {

    handleVerifyNFT();
    if (!currentUserId) {
      console.log("User not logged in.");
      return;
    }

    if (!isValidNFT) {
      toast.error('Invalid NFT token ID or not owned by the current user.');
      return;
    }

    if (formData == null) {
      return;
    }
    if (Object.values(formData).some((value) => value === "" || value === null)) {
      toast.error("Please fill all the fields.");
      return;
    }

    const uploadingToastId = toast.info("Uploading...", { autoClose: false });

    // Fetch the postCount to find the maximum ID
    const db = getDatabase();
    const postCountRef = ref(db, 'Channels/' + currentUserId + '/postCount');
    get(postCountRef)
      .then((snapshot) => {
        const postCount = snapshot.val() || 0;
        const newPostId = postCount + 1;

        
        const uploadFilesToStorage = async () => {
          const storage = getStorage();
          const filesToUpload = ['postImage'];

          const uploadPromises = filesToUpload.map(async (field) => {
            const file = formData[field];
            if (file) {
              try {
                const storageRefPath = `channels/${currentUserId}/posts/${newPostId}/${field}`;
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
            const updatedFormData = { ...formData };
            uploadedFiles.forEach((file) => {
              const [fieldName, fieldValue] = Object.entries(file)[0];
              if (fieldValue) {
                updatedFormData[fieldName] = fieldValue;
              }
            });

            // Save the data to the database
            const newPostNodeRef = ref(db, 'Channels/' + currentUserId + '/posts/' + newPostId);
            set(newPostNodeRef, updatedFormData)
              .then(() => {
                toast.update(uploadingToastId, { render: "Post added successfully", type: toast.TYPE.SUCCESS, autoClose: 1000 });
                // You can perform any other actions here after successful data submission.

                // Update the postCount in the database
                set(postCountRef, newPostId);

                // Reset the form fields
                setFormData({
                  tittle: "",
                  tokenid: "",
                  netPrice: "",
                  postImage: "",
                  termsChecked: false,
                  startnow: "",
                  postTag: "",
                  duration: "",
                  description: "",
                });
              })
              .catch((error) => {
                console.error("Error saving data:", error);
              });
          })
          .catch((error) => {
            console.error("Error uploading files:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching postCount:", error);
      });
  };




  return (
    <div>
      <div class="desk-my-post-inner-content2">
        <div onClick={handleSubmit} style={{ cursor: "pointer" }} class="desk-my-post-bodymain-content2">
          <div class="desk-my-post-bodymain-content2-child"></div>
          <b class="post">Post</b>
        </div>
        <div class="desk-my-post-bodymain-content21">
          <img
            class="desk-my-post-bodymain-content2-item"
            alt=""
            src="./public/rectangle-26.svg"
          />

          <div class="desk-my-post-bodymain-content22">
            <div class="desk-my-post-bodymain-content2-inner"></div>
            <div class="pricing">Pricing</div>
          </div>
          <div class="desk-my-post-bodymain-content23">
            <div class="net-price">
              <img
                class="net-price2"
                alt=""
                src="./public/rectangle-24.svg"
              />
              <input className='input2' type='text' placeholder='Net Price' value={formData.netPrice}
                name='netPrice'
                onChange={handleChange}></input>

              <img
                class="desk-my-post-bodymain-content-icon"
                alt=""
                src="./public/desk-my-post-bodymain-content-etcicon.svg"
              />
            </div>
            <div class="auction-duration">
              <img
                class="net-price2"
                alt=""
                src="./public/rectangle-24.svg"
              />
              <input className='input2' type='text' placeholder='Auction Duration' value={formData.duration}
                name='duration'
                onChange={handleChange}></input>

              <img
                class="desk-my-post-bodymain-content2-icon"
                alt=""
                src="./public/desk-my-post-bodymain-content2-timmer.svg"
              />
            </div>
            <div class="start-now">
              <img
                class="net-price2"
                alt=""
                src="./public/rectangle-24.svg"
              />
              <input className='input2' type='text' placeholder='Start now' value={formData.startnow}
                name='startnow'
                onChange={handleChange}></input>

              <img
                class="desk-my-post-bodymain-content-icon1"
                alt=""
                src="./public/desk-my-post-bodymain-content-arrowdown.svg"
              />
            </div>
          </div>
        </div>
        <div class="desk-my-post-bodymain-content24">
          <img
            class="desk-my-post-bodymain-content2-child1"
            alt=""
            src="./public/rectangle-25.svg"
          />
          <input type='number' placeholder='Unique Token Id' className='input1 i2' value={formData.tokenid}
            name='tokenid'
            onChange={handleChange}></input>

          <img class="ideabulb-icon" alt="" src="./public/ideabulb.svg" />
        </div>
        <div class="desk-my-post-bodymain-content25  desk-my-post-bodymain-content2-item"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >


          <div class="desk-my-post-bodymain-content22">
            <div class="pricing">Description</div>
            <div class="desk-my-post-bodymain-content2-inner"></div>
          </div>
          <textarea name='postDescription'
            onChange={handleChange} style={{ background: "none" }} class="metadata-is-additional" placeholder='Enter description here...'>

          </textarea>
        </div>
        <div class="desk-my-post-bodymain-content27">
          <img
            class="desk-create-channel-name-child"
            alt=""
            src="./public/rectangle-241.svg"
          />
          <input type='text' placeholder='Tittle' className='input1' value={formData.tittle}
            name='tittle'
            onChange={handleChange}></input>

          <img class="bulb-icon" alt="" src="./public/ideabulb.svg" />
        </div>
        <div class="desk-my-post-bodymain-content28">

          <input class="desk-create-terms-child" type='checkbox' name="termsChecked" ></input>
          <div class="terms-conditions1">Terms & Conditions</div>
        </div>
        <div class="desk-my-post-bodymain-content29">
          <img
            class="desk-my-post-bodymain-content2-item"
            alt=""
            src="./public/rectangle-26.svg"
          />

          <div class="desk-my-post-bodymain-content22">
            <div class="pricing">Metadata</div>
            <div class="desk-my-post-bodymain-content2-inner"></div>
          </div>
          <div class="desk-my-post-bodymain-content211">
            <img
              class="download-4-1"
              alt=""
              src={urlUpload}
            />
          </div>
          <div class="desk-my-post-bodymain-content212">
            <div ></div>

            <input type='file' style={{ display: "none" }} id='fileInputpostimg'
              name='postImage'

              onChange={handleChange}
            />
            <label class="desk-my-post-bodymain-content2-child8" htmlFor='fileInputpostimg' >
              <img class="vector-icon6" alt="" src="./public/plus.svg" />

            </label>
          </div>
          <div class="desk-my-post-bodymain-content213">
            <img
              class="desk-my-post-bodymain-content2-child9"
              alt=""
              src="./public/rectangle-251.svg"
            />
            <input type='text' placeholder='NFT Tag' className='input3' name='postTag' value={formData.postTag}

              onChange={handleChange}></input>

            <img class="bulb-icon1" alt="" src="./public/ideabulb.svg" />
          </div>
        </div>
      </div><ToastContainer /></div>
  )
}
