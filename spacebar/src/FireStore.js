import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

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
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc();
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
    projectRef: firebase.firestore.FieldValue.arrayUnion(projectRef.id),
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

export function updatePostTitle(docID, newTitle, projectID) {
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
  draggableId,
  projectID
) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Update task status
  const taskRef = projectRef.collection("tasks").doc(draggableId);
  batch.update(taskRef, { status: destinationList.title });
  // Update kanbanboard state
  const boardRef = projectRef.collection("kanbanboard");
  const srcRef = boardRef.doc(source.droppableId);
  batch.update(srcRef, { items: sourceList.items });
  const destRef = boardRef.doc(destination.droppableId);
  batch.update(destRef, { items: destinationList.items });
  batch.commit();
}

export function deleteKanbanBoardItem(task, listId, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Remove from task collection
  const taskRef = projectRef.collection("tasks").doc(task.id);
  batch.delete(taskRef);
  // Remove from list array
  const listRef = projectRef.collection("kanbanboard").doc(listId);
  batch.update(listRef, {
    items: firebase.firestore.FieldValue.arrayRemove(task.id),
  });
  batch.commit();
}

export function addKanbanBoardItem(
  title,
  listId,
  status,
  currentUser,
  projectID
) {
  const batch = db.batch();
  const taskRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("tasks")
    .doc();
  // Add task to task collection
  const newTask = {
    assignee: "Unassigned",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: `${currentUser.displayName}`,
    description: "",
    id: taskRef.id,
    originalEstimate: 0,
    priority: "Medium",
    status: status,
    timeLogged: 0,
    title: title,
  };
  batch.set(taskRef, newTask);
  // Add task key to list array
  const listRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("kanbanboard")
    .doc(listId);
  batch.update(listRef, {
    items: firebase.firestore.FieldValue.arrayUnion(taskRef.id),
  });
  batch.commit();
}

export function updateTaskDesc(taskId, desc, projectID) {
  updateTaskField(taskId, "description", desc, projectID);
}
export function updateTaskAssignee(taskId, assigneeId, projectID) {
  updateTaskField(taskId, "assignee", assigneeId, projectID);
}
export function updateTaskPriority(taskId, priority, projectID) {
  updateTaskField(taskId, "priority", priority, projectID);
}
export function updateTaskTitle(taskId, title, projectID) {
  updateTaskField(taskId, "title", title, projectID);
}
function updateTaskField(taskId, field, value, projectID) {
  if (
    !(
      field === "assignee" ||
      field === "description" ||
      field === "originalEstimate" ||
      field === "priority" ||
      field === "timeLogged" ||
      field === "title"
    )
  )
    return;
  db.collection("Projects")
    .doc(projectID)
    .collection("tasks")
    .doc(taskId)
    .update({ [field]: value });
}
