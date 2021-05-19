import firebase from 'firebase'; 
import 'firebase/firestore'; 
import 'firebase/auth'; 

const firebaseConfig = {
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

  //Handle Google Log in
  const provider = new firebase.auth.GoogleAuthProvider(); 
  provider.setCustomParameters({prompt: 'select_account'}); 

  //create user document in firestore and return user reference object if user is signed in 
  export const createUserDocument = async(userAuth, additionalData) => {
    if (userAuth) { //user is signed in 
        const userRef = firestore.doc(`users/${userAuth.uid}`);
        const snapshot = await userRef.get(); 

        if (!snapshot.exists) { // user is not yet saved into firestore 
          const {displayName, email} = userAuth; 
          const createdAt = Date.now(); 

          try {
            await userRef.set({
              displayName, 
              email, 
              createdAt, 
              ...additionalData
            })
          } catch (error) {
            console.log(error.message)
          }
        }
        return userRef; 
    } else {
        return; 
    }
  }

  export const signInWithGoogle = () => auth.signInWithPopup(provider); 
  export default firebase; 
  export const auth = firebase.auth(); 
  export const firestore = firebase.firestore(); 