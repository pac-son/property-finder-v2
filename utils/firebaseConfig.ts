import { initializeApp } from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PASTE YOUR KEYS FROM FIREBASE CONSOLE HERE
const firebaseConfig = {
  apiKey: "AIzaSyA5GU5MdyzJD6kCaiEJ0IC6gDJxVxe5xGg",
  authDomain: "property-finder-e2d66.firebaseapp.com",
  projectId: "property-finder-e2d66",
  storageBucket: "property-finder-e2d66.firebasestorage.app",
  messagingSenderId: "630121553339",
  appId: "1:630121553339:web:bbeb264904a5c8d91cb89e",
  measurementId: "G-Z6W3CEV1KW"
};;

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Initialize Auth with Persistence (Keeps user logged in)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// 3. Initialize Database & Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };