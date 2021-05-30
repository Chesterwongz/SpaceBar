import React from "react";
import { db } from "../FireStore";
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../utils/Context";
import Appbar from "../components/Appbar";
import { makeStyles } from "@material-ui/core/styles";
import FolderIcon from "@material-ui/icons/Folder";
import MediaCard from "../components/MediaCard";
import InputContainer from "../components/InputContainer";
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
  },
}));

export default function HomePage() {
  const currentUser = useContext(CurrentUserContext);
  const [projects, setProjects] = useState([]);
  const classes = useStyles();
  // useEffect(() => {
  //   var unSubscribe = db
  //     .collection("Projects")
  //     .doc("project-1")
  //     .collection("projectinfo")
  //     .doc("1OoS5xRD3l6Ih6RIDY5M")
  //     .onSnapshot((doc) => {
  //       setProject(doc.data().projectname);
  //     });
  //   return () => {
  //     unSubscribe();
  //   };
  // }, []);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(currentUser.id)
        .onSnapshot((doc) => {
          setProjects(doc.data().projectRef);
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
        </div>
        <div className={classes.projects}>
          {projects.map((project, index) => {
            return <MediaCard projectref={project} key={index} />;
          })}
          <InputContainer type="project" />
        </div>
      </div>
    </div>
  );
}
