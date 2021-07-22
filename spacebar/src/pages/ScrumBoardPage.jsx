import { Fab, makeStyles, useTheme, Zoom } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScrumBoard from "../components/ScrumBoard";
import SprintBoard from "../components/ScrumBoard/SprintBoard";
import { db, updateCumulativeFlowDate } from "../FireStore";

const useStyles = makeStyles((theme) => ({
  appBar: {},
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    cursor: "pointer",
    border: "none",
  },
  fabAnimated: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    animation: "$pulse 1.5s infinite",
    boxShadow: "0 0 0 0 #80ced680",
    cursor: "pointer",
    border: "none",
  },
  indicator: {
    color: theme.palette.primary.light,
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(.9)",
    },
    "50%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 25px #80ced600",
    },
    "100%": {
      transform: "scale(.9)",
      boxShadow: "0 0 0 0 #80ced600",
    },
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
export default function ScrumBoardPage() {
  const theme = useTheme();
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
  const [noSprint, setNoSprint] = useState(true);
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const fabs = [
    {
      color: "primary",
      className: !noSprint ? classes.fabAnimated : classes.fab,
      icon: <ArrowRightIcon />,
      onClick: handleGoToSprint,
      children: "Go To Sprint",
      variant: "extended",
    },
    {
      color: "primary",
      className: noSprint ? classes.fabAnimated : classes.fab,
      icon: <ArrowLeftIcon />,
      onClick: handleGoToBacklog,
      children: "Go To Backlog",
      variant: "extended",
    },
  ];
  const handleGoToBacklog = () => {
    setSelectedTab(0);
  };
  const handleGoToSprint = () => {
    setSelectedTab(1);
  };
  //Cache kanban board data for cumulative flow diagram
  useEffect(() => {
    //get current sprint ID
    db.collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .doc("backlog")
      .get()
      .then((doc) => {
        return doc.data().currentSprint;
      })
      .then((sprintID) => {
        updateCumulativeFlowDate(projectID, sprintID);
      });
  }, []);
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
  // Get scrum lists
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .orderBy("startDate")
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
        setNoSprint(scrumLists.backlog.currentSprint ? false : true);
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
          {selectedTab === 0 && (
            <ScrumBoard
              tasks={tasks}
              sprintIDs={sprintIds}
              lists={lists}
              members={members}
              currentSprint={lists.backlog.currentSprint}
            />
          )}
          {selectedTab === 1 &&
            (lists.backlog.currentSprint ? (
              <SprintBoard
                tasks={tasks}
                members={members}
                sprintID={lists.backlog.currentSprint}
              />
            ) : (
              <>
                <h1>You haven't started a sprint</h1>
                <br />
                <h2>
                  You can't do anything on your board because you haven't
                  started a sprint yet. Go to the backlog to plan and start a
                  sprint.
                </h2>
                <br />
                <h3>
                  Click on the button on the bottom right of the page to
                  nagivate to the backlog.
                </h3>
              </>
            ))}
          {fabs.map((fab, index) => (
            <Zoom
              key={index}
              in={selectedTab === index}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${
                  selectedTab === index ? transitionDuration.exit : 0
                }ms`,
              }}
              unmountOnExit
            >
              <Fab
                className={fab.className}
                color={fab.color}
                variant={fab.variant}
                onClick={fab.onClick}
              >
                {fab.icon}
                {fab.children}
              </Fab>
            </Zoom>
          ))}
        </div>
      )}
    </>
  );
}
