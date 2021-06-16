import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard/";
import { useParams } from "react-router-dom";
import { db } from "../FireStore";
const stringToColour = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (var i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}; // TODO: Move this somewhere else
export default function BoardPage() {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState({});
  const [tasksLoading, setTasksLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [listsLoading, setListsLoading] = useState(true);
  const [listIds, setListIds] = useState([]);
  const [members, setMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    // Get tasks
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("tasks")
      .onSnapshot((querySnapshot) => {
        const boardTasks = querySnapshot.docs
          .map((doc) => {
            return doc.data();
          })
          .reduce((rest, task) => {
            return {
              ...rest,
              [task.id]: task,
            };
          }, {});
        setTasks(boardTasks);
        setTasksLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    // Get lists
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("kanbanboard")
      .onSnapshot((querySnapshot) => {
        const boardListIds = [];
        const boardLists = querySnapshot.docs
          .map((doc) => {
            boardListIds.push(doc.id); // array of lists in order of doc
            return doc.data();
          })
          .reduce((rest, list) => {
            return {
              ...rest,
              [list.id]: list, // item.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(boardLists);
        setListIds(boardListIds);
        setListsLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  //   useEffect(() => {
  //     // Get sprints
  //     let unsubscribe = db
  //       .collection("Projects")
  //       .doc(projectID)
  //       .collection("scrum")
  //       .where("id", "!=", "backlog")
  //       .orderBy("createdAt")
  //       .onSnapshot((querySnapshot) => {
  //         const boardListIds = [];
  //         const boardLists = querySnapshot.docs
  //           .map((doc) => {
  //             boardListIds.push(doc.id); // array of lists in order of doc
  //             return doc.data();
  //           })
  //           .reduce((rest, sprint) => {
  //             return {
  //               ...rest,
  //               [sprint.id]: sprint, // sprint.id needs to be equal to doc.id!!!
  //             };
  //           }, {});
  //         setLists(boardLists);
  //         setListIds(boardListIds);
  //         setLoading(false);
  //       });
  //     return () => {
  //       unsubscribe();
  //     };
  //   }, []);
  useEffect(() => {
    // Get board members
    let unsubscribe = db
      .collection("users")
      .where("projectRef", "array-contains", projectID)
      .onSnapshot((querySnapshot) => {
        const boardMembers = querySnapshot.docs.reduce((rest, memberDoc) => {
          return {
            ...rest,
            [memberDoc.id]: {
              displayName: memberDoc.data().displayName,
              backgroundColor: stringToColour(memberDoc.id),
            },
          };
        }, {});
        setMembers(boardMembers);
        setMembersLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {tasksLoading || listsLoading || membersLoading ? (
        <CircularProgress />
      ) : (
        <KanbanBoard
          tasks={tasks}
          lists={lists}
          listIds={listIds}
          members={members}
        />
      )}
    </>
  );
}
