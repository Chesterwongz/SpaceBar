import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVXn1Uj5ogR_NHGpoY-WAkma2bECXs35o",
  authDomain: "spaceba-r.firebaseapp.com",
  projectId: "spaceba-r",
  storageBucket: "spaceba-r.appspot.com",
  messagingSenderId: "116383418235",
  appId: "1:116383418235:web:c23e6a1c18e4f183035fde",
  measurementId: "G-EQ9JMYW6WW",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//Handle Google Log in
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () =>
  auth.signInWithPopup(provider).catch((error) => {
    console.log(error);
  });

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
    console.log("auth state changed", userAuth);
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
    isScrum: false,
    listIDs: ["list-1", "list-2", "list-3"],
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
export function addScrumProject(title, currentUser) {
  const batch = db.batch();
  // Create project
  const projectRef = db.collection("Projects").doc();
  batch.set(projectRef, {
    isScrum: true,
    listIDs: ["list-1", "list-2", "list-3"],
    projectInfo: { title: title },
  });
  // Create hangouts
  const drawingBoardref = projectRef.collection("drawingboard").doc();
  batch.set(drawingBoardref, {
    title: "Be the first to initiate a discussion!",
    userID: `${currentUser.id}`,
  });
  // Create backlog
  const backlogRef = projectRef.collection("scrum").doc("backlog");
  batch.set(backlogRef, {
    title: "Backlog",
    id: "backlog",
    items: [],
    currentSprint: "",
    startDate: new Date(),
  });
  // Create backlog board
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
    const listRef = backlogRef.collection("board").doc(doc.id);
    batch.set(listRef, doc);
  });
  // Add project to user
  const userRef = db.collection("users").doc(currentUser.id);
  batch.update(userRef, {
    projectRef: firebase.firestore.FieldValue.arrayUnion(projectRef.id),
  });
  batch.commit();
}
export async function deleteProject(projectID) {
  const batch = db.batch();
  // const projectRef = db.collection("Projects").doc(projectID);
  // batch.delete(projectRef);
  // need to delete the collections somehow idk how
  await db
    .collection("users")
    .where("projectRef", "array-contains", projectID)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((user) => {
        batch.update(user.ref, {
          projectRef: firebase.firestore.FieldValue.arrayRemove(projectID),
        });
      });
    });
  await batch.commit();
}
export function deleteTask(taskID, projectID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("tasks")
    .doc(taskID)
    .delete()
    .catch((error) => {
      console.log("Error when deleting document" + error);
    });
}
export function unarchiveTask(taskID, projectID, isScrumProject) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Update task status to todo
  const taskRef = projectRef.collection("tasks").doc(taskID);
  batch.update(taskRef, { status: "list-1" });
  // Add task to todo list
  const listRef = isScrumProject
    ? projectRef.collection("scrum").doc("backlog")
    : projectRef.collection("kanbanboard").doc("list-1");
  batch.update(listRef, {
    items: firebase.firestore.FieldValue.arrayUnion(taskID),
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
export function updateEpicTitle(docID, newTitle, projectID) {
  return db
    .collection("Projects")
    .doc(projectID)
    .collection("epics")
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

export function addComment(projectID, docID, value, author, authorID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("drawingboard")
    .doc(docID)
    .collection("comments")
    .add({
      comment: value,
      created: Date.now(),
      author: author,
      authorID: authorID,
    });
}

export function addList(title, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  const listRef = projectRef.collection("kanbanboard").doc();
  batch.update(projectRef, {
    listIDs: firebase.firestore.FieldValue.arrayUnion(listRef.id),
  });
  batch.set(listRef, { title: title, items: [], id: listRef.id });
  batch.commit();
}

export function deleteList(listID, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  const listRef = projectRef.collection("kanbanboard").doc(listID);
  batch.update(projectRef, {
    listIDs: firebase.firestore.FieldValue.arrayRemove(listID),
  });
  batch.delete(listRef);
  batch.commit();
}

export function updateListTitle(newTitle, listID, projectID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("kanbanboard")
    .doc(listID)
    .update({ title: newTitle });
}

export function dndList(newListIDs, projectID) {
  db.collection("Projects").doc(projectID).update({ listIDs: newListIDs });
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
  batch.update(taskRef, { status: destinationList.id });
  // Update kanbanboard state
  const boardRef = projectRef.collection("kanbanboard");
  const srcRef = boardRef.doc(source.droppableId);
  batch.update(srcRef, { items: sourceList.items });
  const destRef = boardRef.doc(destination.droppableId);
  batch.update(destRef, { items: destinationList.items });
  //cumulative flow update
  const cumulativeFlowRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("cumulativeflow")
    .doc(formatDate(Date.now()));
  batch.set(
    cumulativeFlowRef,
    {
      statuses: {
        [sourceList.id]: firebase.firestore.FieldValue.increment(-1),
        [destinationList.id]: firebase.firestore.FieldValue.increment(1),
      },
    },
    { merge: true }
  );
  batch.commit();
}

export function archiveKanbanBoardTask(task, listId, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Update Task status to Archived
  const taskRef = projectRef.collection("tasks").doc(task.id);
  batch.update(taskRef, { status: "Archived" });
  // Remove from list array
  const listRef = projectRef.collection("kanbanboard").doc(listId);
  batch.update(listRef, {
    items: firebase.firestore.FieldValue.arrayRemove(task.id),
  });
  //Edit cumulative flow diagram by decrementing list by 1
  const cumulativeFlowRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("cumulativeflow")
    .doc(formatDate(Date.now()));
  batch.set(
    cumulativeFlowRef,
    {
      statuses: {
        [listId]: firebase.firestore.FieldValue.increment(-1),
      },
    },
    { merge: true }
  );
  batch.commit();
}

export function addKanbanBoardItem(title, listId, currentUser, projectID) {
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
    status: listId,
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
  //Edit cumulative flow diagram by incrementing list by 1
  const cumulativeFlowRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("cumulativeflow")
    .doc(formatDate(Date.now()));
  batch.set(
    cumulativeFlowRef,
    {
      statuses: {
        [listId]: firebase.firestore.FieldValue.increment(1),
      },
    },
    { merge: true }
  );
  batch.commit();
}
export function addTaskComment(projectID, taskId, value, author, authorID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("tasks")
    .doc(taskId)
    .collection("comments")
    .add({
      comment: value,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      author: author,
      authorID: authorID,
    });
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

export function moveTask(task, srcList, destList, projectId) {
  const batch = db.batch();
  const srcRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("kanbanboard")
    .doc(srcList);
  batch.update(srcRef, {
    items: firebase.firestore.FieldValue.arrayRemove(task),
  });
  const destRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("kanbanboard")
    .doc(destList);
  batch.update(destRef, {
    items: firebase.firestore.FieldValue.arrayUnion(task),
  });
  const taskRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("tasks")
    .doc(task);
  batch.update(taskRef, { status: destList });

  //Edit cumulative flow diagram by editing source and destination list
  const cumulativeFlowRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("cumulativeflow")
    .doc(formatDate(Date.now()));
  batch.set(
    cumulativeFlowRef,
    {
      statuses: {
        [srcList]: firebase.firestore.FieldValue.increment(-1),
        [destList]: firebase.firestore.FieldValue.increment(1),
      },
    },
    { merge: true }
  );
  batch.commit();
}
export function moveScrumTask(task, srcList, destList, sprintID, projectID) {
  const batch = db.batch();
  const srcRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc(sprintID)
    .collection("board")
    .doc(srcList);
  batch.update(srcRef, {
    items: firebase.firestore.FieldValue.arrayRemove(task),
  });
  const destRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc(sprintID)
    .collection("board")
    .doc(destList);
  batch.update(destRef, {
    items: firebase.firestore.FieldValue.arrayUnion(task),
  });
  const taskRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("tasks")
    .doc(task);
  batch.update(taskRef, { status: destList });
  batch.commit();
  updateCumulativeFlowDate(projectID, sprintID);
}
export async function addScrumList(title, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  const scrumRef = projectRef.collection("scrum");
  const backlogListRef = scrumRef.doc("backlog").collection("board").doc();
  batch.update(projectRef, {
    listIDs: firebase.firestore.FieldValue.arrayUnion(backlogListRef.id),
  });
  await scrumRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const listRef = doc.ref.collection("board").doc(backlogListRef.id);
      batch.set(listRef, { id: backlogListRef.id, title: title, items: [] });
    });
  });
  await batch.commit();
}

export async function deleteScrumList(listID, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  const scrumRef = projectRef.collection("scrum");
  await scrumRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const listRef = doc.ref.collection("board").doc(listID);
      batch.delete(listRef);
    });
  });
  batch.update(projectRef, {
    listIDs: firebase.firestore.FieldValue.arrayRemove(listID),
  });
  await batch.commit();
}

export async function updateScrumListTitle(newTitle, listID, projectID) {
  const batch = db.batch();
  const scrumRef = db.collection("Projects").doc(projectID).collection("scrum");
  await scrumRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const listRef = doc.ref.collection("board").doc(listID);
      batch.update(listRef, { title: newTitle });
    });
  });
  await batch.commit();
}

export function dndScrumBoardTasks(
  destination,
  source,
  sourceList,
  destinationList,
  draggingCard,
  projectID
) {
  //Updates cumulative flow whenever task moves from backlog to sprint list and vice versa
  if (destinationList.id !== "backlog") {
    updateCumulativeFlowDate(projectID, destinationList.id);
  } else {
    db.collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .doc("backlog")
      .get()
      .then((doc) => {
        const currentSprintID = doc.data().currentSprint;
        updateCumulativeFlowDate(projectID, currentSprintID);
      });
  }

  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Update scrum board state
  const boardRef = projectRef.collection("scrum");
  const srcRef = boardRef.doc(source.droppableId);
  batch.update(srcRef, { items: sourceList.items });
  const destRef = boardRef.doc(destination.droppableId);
  batch.update(destRef, { items: destinationList.items });
  if (source.droppableId !== destination.droppableId) {
    // Update sprint board state
    const srcBoardRef = srcRef.collection("board").doc(draggingCard.status);
    batch.update(srcBoardRef, {
      items: firebase.firestore.FieldValue.arrayRemove(draggingCard.id),
    });
    const destBoardRef = destRef.collection("board").doc(draggingCard.status);
    batch.update(destBoardRef, {
      items: firebase.firestore.FieldValue.arrayUnion(draggingCard.id),
    });
  }
  batch.commit();
}

export function addScrumBoardTask(title, listID, currentUser, projectID) {
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
    status: "list-1",
    timeLogged: 0,
    title: title,
  };
  batch.set(taskRef, newTask);
  // Add task key to list array
  const listRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc(listID);
  batch.update(listRef, {
    items: firebase.firestore.FieldValue.arrayUnion(taskRef.id),
  });
  // Add task key to sprint todo list
  const todoRef = listRef.collection("board").doc("list-1");
  batch.update(todoRef, {
    items: firebase.firestore.FieldValue.arrayUnion(taskRef.id),
  });
  batch.commit();
  //update cumulative flow
  if (listID !== "backlog") {
    updateCumulativeFlowDate(projectID, listID);
  }
}

export function archiveScrumBoardTask(task, sprintID, projectID) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Change status to ARCHIVED in task collection
  const taskRef = projectRef.collection("tasks").doc(task.id);
  batch.update(taskRef, { status: "Archived" });
  // Remove from list array
  const listRef = projectRef.collection("scrum").doc(sprintID);
  batch.update(listRef, {
    items: firebase.firestore.FieldValue.arrayRemove(task.id),
  });
  // Remove from sprint list array
  const sprintListRef = listRef.collection("board").doc(task.status);
  batch.update(sprintListRef, {
    items: firebase.firestore.FieldValue.arrayRemove(task.id),
  });
  batch.commit();
  //Updates cumulative flow whenever task moves from backlog to sprint list and vice versa
  updateCumulativeFlowDate(projectID, sprintID);
}

export async function addSprint(projectId, count) {
  const scrumRef = db.collection("Projects").doc(projectId).collection("scrum");
  const sprintRef = scrumRef.doc();
  const newSprint = {
    id: sprintRef.id,
    title: "Sprint " + count,
    items: [],
    startDate: new Date(),
    endDate: new Date(),
  };
  sprintRef.set(newSprint);
  const batch = db.batch();
  await scrumRef
    .doc("backlog")
    .collection("board")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const listRef = sprintRef.collection("board").doc(doc.id);
        batch.set(listRef, { id: doc.id, title: doc.data().title, items: [] });
      });
    });
  batch.commit();
}

export function updateSprintDate(dateRange, sprintID, projectID) {
  const startDate = dateRange !== null ? dateRange[0] : null;
  const endDate = dateRange !== null ? dateRange[1] : null;
  db.collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc(sprintID)
    .update({ startDate: startDate, endDate: endDate });
}

export async function deleteSprint(sprintId, taskArr, projectId) {
  const batch = db.batch();
  const sprintRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("scrum")
    .doc(sprintId);
  batch.delete(sprintRef);
  await sprintRef
    .collection("boards")
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      })
    );
  // Move sprint items to backlog
  const destRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("scrum")
    .doc("backlog");
  batch.update(destRef, {
    items: firebase.firestore.FieldValue.arrayUnion(...taskArr),
  });
  batch.commit();
}
export async function completeSprint(sprintID, taskArr, tasks, projectID) {
  setSprint("", projectID);
  const batch = db.batch();
  const sprintRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc(sprintID);
  batch.delete(sprintRef);
  taskArr.forEach((taskID) => {
    archiveScrumBoardTask(tasks[taskID], sprintID, projectID);
  });
  await sprintRef
    .collection("boards")
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      })
    );
  batch.commit();
}
export function setSprint(sprintId, projectID) {
  db.collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc("backlog")
    .update({ currentSprint: sprintId });
  updateCumulativeFlowDate(projectID, sprintId);
}
export function dndSprintBoardItems(
  destination,
  source,
  sourceList,
  destinationList,
  draggableID,
  sprintID,
  projectID
) {
  const batch = db.batch();
  const projectRef = db.collection("Projects").doc(projectID);
  // Update task status
  const taskRef = projectRef.collection("tasks").doc(draggableID);
  batch.update(taskRef, { status: destinationList.id });
  // Update kanbanboard state
  const boardRef = projectRef
    .collection("scrum")
    .doc(sprintID)
    .collection("board");
  const srcRef = boardRef.doc(source.droppableId);
  batch.update(srcRef, { items: sourceList.items });
  const destRef = boardRef.doc(destination.droppableId);
  batch.update(destRef, { items: destinationList.items });
  //Edit cumulative flow diagram by editing source and destination list
  const cumulativeFlowRef = db
    .collection("Projects")
    .doc(projectID)
    .collection("cumulativeflow")
    .doc(formatDate(Date.now()));
  batch.set(
    cumulativeFlowRef,
    {
      statuses: {
        [sourceList.id]: firebase.firestore.FieldValue.increment(-1),
        [destinationList.id]: firebase.firestore.FieldValue.increment(1),
      },
    },
    { merge: true }
  );
  batch.commit();
}
//Convert date.now() to format in cumulativeflow database
export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear().toString().slice(2, 4);

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("");
}

//function that returns object containing status of kanban board
export function getKanbanStatus(projectID, scrumID) {
  return db
    .collection("Projects")
    .doc(projectID)
    .collection("scrum")
    .doc(scrumID)
    .collection("board")
    .get()
    .then((querySnapshot) => {
      const status = {};

      querySnapshot.forEach((doc) => {
        status[doc.data().id] = doc.data().items.length;
      });
      return status;
    });
}

export function updateCumulativeFlowDate(projectID, scrumID) {
  if (scrumID) {
    //Check if it is a new day and new data update is needed
    const dateToday = formatDate(Date.now());
    db.collection("Projects")
      .doc(projectID)
      .collection("cumulativeflow")
      .where("id", "==", dateToday)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          // today is not yet recorded in database
          //update new document
          getKanbanStatus(projectID, scrumID).then((status) => {
            db.collection("Projects")
              .doc(projectID)
              .collection("cumulativeflow")
              .doc(dateToday)
              .set({
                id: dateToday,
                statuses: status,
              });
          });
        } else {
          getKanbanStatus(projectID, scrumID).then((status) => {
            db.collection("Projects")
              .doc(projectID)
              .collection("cumulativeflow")
              .doc(dateToday)
              .update({
                statuses: status,
              });
          });
        }
      });
  }
}
