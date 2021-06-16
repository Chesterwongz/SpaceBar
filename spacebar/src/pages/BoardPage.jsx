import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard/";
import ScrumBoard from "../components/ScrumBoard/";
import { useParams } from "react-router-dom";
import { db } from "../FireStore";
import { Tabs, Tab, AppBar, makeStyles } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
const useStyles = makeStyles((theme) => ({
  appBar: {},
  indicator: {
    color: theme.palette.primary.light,
  },
}));
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
  const classes = useStyles();
  const { projectID } = useParams();
  const [tasks, setTasks] = useState({});
  const [tasksLoading, setTasksLoading] = useState(true);
  const [sprintIds, setSprintIds] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [members, setMembers] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
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

  return (
    <>
      {tasksLoading || sprintsLoading || membersLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <AppBar position="static" className={classes.appBar}>
            <Tabs
              TabIndicatorProps={classes.indicator}
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Backlog" />
              <Tab label="Sprint" />
            </Tabs>
          </AppBar>
          {selectedTab === 0 && (
            <ScrumBoard
              tasks={tasks}
              sprintIds={sprintIds}
              lists={lists}
              members={members}
            />
          )}
          {selectedTab === 1 && <div>Page 2</div>}
        </div>
      )}
    </>
  );
}
