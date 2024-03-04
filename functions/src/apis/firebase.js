// const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore();

// Initialize Firebase Auth
const auth = getAuth(app);

module.exports = { auth, db, firebaseConfig };
