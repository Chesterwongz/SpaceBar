import React from "react";
import { db } from "../FireStore";
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../utils/Context";
import Appbar from "../components/Appbar";
import { makeStyles } from "@material-ui/core/styles";
import FolderIcon from "@material-ui/icons/Folder";
import MediaCard from "../components/MediaCard";
import InputContainer from "../components/InputContainer";
import PendingProjects from "../components/PendingProjects";
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 80,
    marginLeft: 80,
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: 35,
    color: "#80ced6",
    marginRight: 10,
    marginLeft: 30,
  },
  projects: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    width: "70vw",
  },
  InputContainer: {
    marginLeft: 50,
    cursor: "pointer",
  },
  main: {
    display: "flex",
  },
}));

export default function HomePage() {
  const currentUser = useContext(CurrentUserContext);
  const [projects, setProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(currentUser.id)
        .onSnapshot((doc) => {
          setProjects(doc.data().projectRef);
          if (doc.data().pending) {
            setPendingProjects(doc.data().pending);
          }
        });
    }
  }, [currentUser]);

  return (
    <div>
      <Appbar />
      <div className={classes.root}>
        <div className={classes.header}>
          <FolderIcon className={classes.icon} />
          <h1>Projects</h1>
          <div className={classes.InputContainer}>
            <InputContainer type="project" />
          </div>
        </div>
        <div className={classes.main}>
          <div>
            {currentUser ? (
              <div>
                <PendingProjects
                  pendingProjects={pendingProjects}
                  currentUserID={currentUser.id}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div>
            {projects ? (
              <div className={classes.projects}>
                {projects.map((project, index) => {
                  return <MediaCard projectRef={project} key={index} />;
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
