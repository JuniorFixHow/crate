import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {initializeFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling:true
})

export const auth = getAuth(app);
