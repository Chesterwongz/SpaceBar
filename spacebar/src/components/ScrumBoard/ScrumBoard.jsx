import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { db, dndScrumBoardTasks, addSprint } from "../../FireStore";
import Backlog from "./Backlog";
import Sprint from "./Sprint";
import { Typography, Button } from "@material-ui/core";

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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "80vw",
  },
  backlog: {
    flex: "0 0 50%",
  },
  sprints: {
    flex: "0 0 50%",
    display: "flex",
    flexDirection: "column",
  },
}));

export default function ScrumBoard() {
  let count = 1;
  const classes = useStyles();
  const { projectID } = useParams();
  const [tasks, setTasks] = useState({});
  const [tasksLoading, setTasksLoading] = useState(true);
  const [sprintIds, setSprintIds] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(true);
  const [lists, setLists] = useState({});
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
  // Get lists
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .orderBy("title")
      .onSnapshot((querySnapshot) => {
        const scrumSprintIds = [];
        const scrumLists = querySnapshot.docs
          .map((doc) => {
            if (doc.id !== "backlog") scrumSprintIds.push(doc.id);
            // array of lists in order of doc
            return doc.data();
          })
          .reduce((rest, list) => {
            return {
              ...rest,
              [list.id]: list, // sprint.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(scrumLists);
        setSprintIds(scrumSprintIds);
        setSprintsLoading(false);
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

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    sourceList.tasks.splice(source.index, 1);
    destinationList.tasks.splice(destination.index, 0, draggableId);
    dndScrumBoardTasks(
      destination,
      source,
      sourceList,
      destinationList,
      projectID
    );
  };
  const handleClick = () => {
    addSprint(projectID, count);
  };
  return (
    <>
      {tasksLoading || sprintsLoading || membersLoading ? (
        <div className={classes.root}>
          <CircularProgress />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classes.root}>
            <div className={classes.backlog}>
              <Backlog
                key="backlog"
                list={lists.backlog}
                tasks={tasks}
                members={members}
              />
            </div>
            <div className={classes.sprints}>
              {sprintIds.map((sprintId, index) => {
                const sprint = lists[sprintId];
                count++;
                return (
                  sprint && (
                    <Sprint
                      key={sprint.id}
                      list={sprint}
                      tasks={tasks}
                      members={members}
                      index={index}
                    />
                  )
                );
              })}
              <Button fullWidth onClick={handleClick}>
                <Typography>+ Add Sprint</Typography>
              </Button>
            </div>
          </div>
        </DragDropContext>
      )}
    </>
  );
}
