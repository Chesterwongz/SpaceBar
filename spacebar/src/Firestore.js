import firebase from 'firebase'; 

var firebaseConfig = {
    apiKey: "AIzaSyBZVzhpyToko-9GU1uU-tj1pIWYKmwCxNY",
    authDomain: "spacebar-1a6ff.firebaseapp.com",
    projectId: "spacebar-1a6ff",
    storageBucket: "spacebar-1a6ff.appspot.com",
    messagingSenderId: "763570786151",
    appId: "1:763570786151:web:6274bc91a65b746111a9c2",
    measurementId: "G-CHC7V7LZJ2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase; 