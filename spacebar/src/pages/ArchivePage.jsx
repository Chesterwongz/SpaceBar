import { makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../FireStore";
import TaskCard from "../components/KanbanBoard/TaskCard.jsx";
import { CircularProgress } from "@material-ui/core";

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
const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  paper: {
    width: "480px",
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1, 1, 1, 1),
    margin: theme.spacing(1),
  },
  item: {
    margin: theme.spacing(1, 0),
  },
}));

export default function ArchivePage() {
  const classes = useStyles();
  const { projectID } = useParams();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [members, setMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);
  const [isScrum, setIsScrum] = useState(null);
  // Check if scrum project
  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .get()
      .then((doc) => {
        setIsScrum(doc.data().isScrum);
      });
  }, []);
  // Get archived tasks
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("tasks")
      .where("status", "==", "Archived")
      .onSnapshot((querySnapshot) => {
        const archivedTasks = [];
        querySnapshot.forEach((doc) => archivedTasks.push(doc.data()));
        setTasks(archivedTasks);
        setTasksLoading(false);
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
      {tasksLoading || membersLoading ? (
        <CircularProgress />
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="h6">Archive</Typography>
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              members={members}
              index={index}
              isScrum={isScrum}
            />
          ))}
        </Paper>
      )}
      <Typography className={classes.root}>
        Archived tasks will be deleted permanently
      </Typography>
    </>
  );
}
