import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAepBKportvYs_aUHtH7qxEy49o-jy2sAw",
  authDomain: "cryptors-bbaf4.firebaseapp.com",
  projectId: "cryptors-bbaf4",
  storageBucket: "cryptors-bbaf4.appspot.com",
  messagingSenderId: "13786482775",
  appId: "1:13786482775:web:3b8ba114edb1493ac7fb12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;