import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import Backlog from "./Backlog";
import { db } from "../../FireStore";
import { makeStyles } from "@material-ui/styles";
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
  },
  sprints: {
    display: "flex",
    flexDirection: "column",
  },
}));
export default function ScrumBoard() {
  const classes = useStyles();
  const { projectID } = useParams();
  const [tasks, setTasks] = useState({});
  const [tasksLoading, setTasksLoading] = useState(true);
  const [sprintIds, setSprintIds] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [members, setMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);
  const [backlogLoading, setBacklogLoading] = useState(true);

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
    // Get backlog
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .doc("backlog")
      .onSnapshot((doc) => {
        setLists({ ...lists, [doc.id]: doc.data() });
        setBacklogLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    // Get sprints
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .where("id", "!=", "backlog")
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const scrumSprintIds = [];
        const scrumSprints = querySnapshot.docs
          .map((doc) => {
            scrumSprintIds.push(doc.id); // array of lists in order of doc
            return doc.data();
          })
          .reduce((rest, sprint) => {
            return {
              ...rest,
              [sprint.id]: sprint, // sprint.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists({ ...lists, ...scrumSprints });
        setSprintIds(scrumSprintIds);
        setSprintsLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
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

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    sourceList.tasks.splice(source.index, 1);
    destinationList.tasks.splice(destination.index, 0, draggableId);
    // console.log(
    //   destination,
    //   source,
    //   sourceList,
    //   destinationList,
    //   draggableId,
    //   projectID
    // );
  };

  return (
    <>
      {tasksLoading || sprintsLoading || backlogLoading || membersLoading ? (
        <CircularProgress />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classes.root}>
            <Backlog
              key="backlog"
              list={lists.backlog}
              tasks={tasks}
              members={members}
            />
            <div className={classes.sprints}>
              {sprintIds.map((sprintId, index) => {
                const sprint = lists[sprintId];
                return (
                  <KanbanBoard
                    key={list.id}
                    list={list}
                    lists={lists}
                    listIds={listIds}
                    tasks={tasks}
                    members={members}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        </DragDropContext>
      )}
    </>
  );
}
