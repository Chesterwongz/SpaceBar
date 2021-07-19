import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard/";
import { db, updateCumulativeFlowDate } from "../FireStore";

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
};
export default function KanbanBoardPage() {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState({});
  const [tasksLoading, setTasksLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [listsLoading, setListsLoading] = useState(true);
  const [listIDs, setListIDs] = useState([]);
  const [listIDsLoading, setListIDsLoading] = useState(true);
  const [members, setMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);

  // Get tasks
  useEffect(() => {
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
  // Get kanbanboard lists
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("kanbanboard")
      .onSnapshot((querySnapshot) => {
        const boardLists = querySnapshot.docs
          .map((doc) => {
            return doc.data();
          })
          .reduce((rest, list) => {
            return {
              ...rest,
              [list.id]: list, // sprint.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(boardLists);
        setListsLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // Get kanbanboard list order
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .onSnapshot((doc) => {
        setListIDs(doc.data().listIDs);
        setListIDsLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // Get board members
  useEffect(() => {
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
      {tasksLoading || listsLoading || listIDsLoading || membersLoading ? (
        <CircularProgress />
      ) : (
        <KanbanBoard
          tasks={tasks}
          lists={lists}
          listIDs={listIDs}
          members={members}
        />
      )}
    </>
  );
}
