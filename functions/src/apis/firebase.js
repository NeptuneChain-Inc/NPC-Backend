// const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

// const firebaseConfig = {
//   apiKey: process.env.FB_API_KEY,
//   authDomain: process.env.FB_AUTH_DOMAIN,
//   databaseURL: process.env.FB_DATABASE_URL,
//   projectId: process.env.FB_PROJECT_ID,
//   storageBucket: process.env.FB_STORAGE_BUCKET,
//   messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
//   appId: process.env.FB_APP_ID,
//   measurementId: process.env.FB_MEASUREMENT_ID,
// };

/** Local Config */
const firebaseConfig = {
  apiKey: "AIzaSyDIbFUYETjr9k2j1qjwV793zSSmJdjjzbc",
  authDomain: "app-neptunechain.firebaseapp.com",
  databaseURL: "https://app-neptunechain-default-rtdb.firebaseio.com",
  projectId: "app-neptunechain",
  storageBucket: "app-neptunechain.appspot.com",
  messagingSenderId: "477231879849",
  appId: "1:477231879849:web:90b49665fce2d4660b7bb8",
  measurementId: "G-WN6DP7ZHWC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getDatabase();

// Initialize Firebase Auth
const auth = getAuth(app);

module.exports = { auth, db, firebaseConfig };
