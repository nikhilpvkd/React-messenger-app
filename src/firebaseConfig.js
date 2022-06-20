// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDSSdkbnPkliUUqgOwj3UTuchF_RWWZHEc",
	authDomain: "react-messenger-77da5.firebaseapp.com",
	projectId: "react-messenger-77da5",
	storageBucket: "react-messenger-77da5.appspot.com",
	messagingSenderId: "31012739128",
	appId: "1:31012739128:web:9672566047a957dee6aecd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };