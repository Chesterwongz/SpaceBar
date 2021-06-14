import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import uuid from "react-uuid";

const firebaseConfig = {
  apiKey: "AIzaSyBZVzhpyToko-9GU1uU-tj1pIWYKmwCxNY",
  authDomain: "spacebar-1a6ff.firebaseapp.com",
  projectId: "spacebar-1a6ff",
  storageBucket: "spacebar-1a6ff.appspot.com",
  messagingSenderId: "763570786151",
  appId: "1:763570786151:web:6274bc91a65b746111a9c2",
  measurementId: "G-CHC7V7LZJ2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//Handle Google Log in
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export default firebase;
export const auth = firebase.auth();
export const db = firebase.firestore();

//create user document in firestore and return user reference object if user is signed in
export const createUserDocument = async (userAuth, additionalData) => {
  if (userAuth) {
    //user is signed in
    const userRef = db.doc(`users/${userAuth.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      // user is not yet saved into firestore
      const { displayName, email } = userAuth;
      const createdAt = Date.now();

      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    return userRef;
  } else {
    return;
  }
};

export var uiConfig = {
  signInSuccessUrl: "/home",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: "/",
  // Privacy policy url/callback.
  privacyPolicyUrl: function () {
    window.location.assign("/");
  },
};

export function onAuthStateChange(callback) {
  return auth.onAuthStateChanged(async (userAuth) => {
    if (userAuth) {
      const userRef = await createUserDocument(userAuth);
      userRef.onSnapshot((snapShot) => {
        callback({
          id: snapShot.id,
          ...snapShot.data(),
        });
      });
    } else {
      callback(null);
    }
  });
}

export function addProject(title, currentUser) {
  const projectId = uuid(); // I want to avoid using uuid and just use firebase auto gen
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectId);
  batch.set(projectRef, {
    projectInfo: { title: title },
  });
  const drawingBoardref = projectRef.collection("drawingboard").doc();
  batch.set(drawingBoardref, {
    title: "Be the first to initiate a discussion!",
    userID: `${currentUser.id}`,
  });
  const lists = [
    {
      id: `list-1`,
      title: "Todo",
      items: [],
    },
    {
      id: `list-2`,
      title: "Doing",
      items: [],
    },
    {
      id: `list-3`,
      title: "Done",
      items: [],
    },
  ];
  lists.forEach((doc) => {
    const listRef = projectRef.collection("kanbanboard").doc(doc.id);
    batch.set(listRef, doc);
  });
  const userRef = db.collection("users").doc(currentUser.id);
  batch.update(userRef, {
    projectRef: firebase.firestore.FieldValue.arrayUnion(projectId),
  });
  batch.commit();
}

export function addDrawingBoardItem(userID, title, projectID) {
  return db
    .collection("Projects")
    .doc(projectID)
    .collection("drawingboard")
    .add({
      title,
      userID,
    });
}

export function deleteDrawingBoardItem(docID, projectID) {
  return db
    .collection("Projects")
    .doc(projectID)
    .collection("drawingboard")
    .doc(docID)
    .delete()
    .catch((error) => {
      console.log("Error when deleting document" + error);
    });
}

export function updateDrawingBoardTitle(docID, newTitle, projectID) {
  return db
    .collection("Projects")
    .doc(projectID)
    .collection("drawingboard")
    .doc(docID)
    .update({
      title: newTitle,
    })
    .catch((error) => {
      console.log("Error updating drawing board title", error);
    });
}

export function getProjectInfo(projectref) {
  const docRef = db.collection("Projects").doc(projectref);
  docRef.get().then((doc) => {
    return doc.data().projectInfo;
  });
}

export function addComment(projectID, docID, value, author) {
  db.collection("Projects")
    .doc(projectID)
    .collection("drawingboard")
    .doc(docID)
    .collection("comments")
    .add({
      comment: value,
      created: Date.now(),
      author: author,
    });
}

export function updateKanbanBoardItems(
  destination,
  source,
  sourceList,
  destinationList,
  projectID
) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  const boardRef = projectRef.collection("kanbanboard");
  const srcRef = boardRef.doc(source.droppableId);
  batch.update(srcRef, { items: sourceList.items });
  const destRef = boardRef.doc(destination.droppableId);
  batch.update(destRef, { items: destinationList.items });
  batch.commit();
}

export function deleteKanbanBoardItem(item, listId, projectID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("kanbanboard")
    .doc(listId)
    .update({
      items: firebase.firestore.FieldValue.arrayRemove(item),
    });
}

export function addKanbanBoardItem(title, listId, projectID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("kanbanboard")
    .doc(listId)
    .update({
      items: firebase.firestore.FieldValue.arrayUnion({
        id: `${uuid()}`,
        title: title,
        dateCreated: Date.now(), //Cannot use Firebase timestamp since it is an element of an array
        //and not an actual document field
      }),
    });
}
