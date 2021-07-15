import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../FireStore";
import firebase from "firebase";
const useStyles = makeStyles((theme) => ({
  invitation: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "10px 20px",
    height: "100px",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
  },

  button: {
    backgroundColor: theme.palette.secondary.main,
    border: "none",
    height: "30px",
    borderRadius: "30px",
    width: "60px",
    cursor: "pointer",
    textAlign: "center",
    "&:hover": {
      transform: "scale(1.1)",
      transition: "0.2s ease-in-out",
    },
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
  },
  projectName: {
    fontSize: "1.2rem",
  },
}));
const Invitation = ({ projectID, currentUserID }) => {
  const classes = useStyles();
  const [name, setName] = useState("");

  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .get()
      .then((doc) => {
        setName(doc.data().projectInfo.title);
      });
  }, []);

  const handleClick = () => {
    db.collection("users")
      .doc(currentUserID)
      .update({
        projectRef: firebase.firestore.FieldValue.arrayUnion(projectID),
        pending: firebase.firestore.FieldValue.arrayRemove(projectID),
      });
  };
  const handleIgnore = () => {
    db.collection("users")
      .doc(currentUserID)
      .update({
        pending: firebase.firestore.FieldValue.arrayRemove(projectID),
      });
  };
  return (
    <div className={classes.invitation}>
      <div className={classes.projectName}>{name}</div>
      <div className={classes.buttonContainer}>
        <button className={classes.button} onClick={handleClick}>
          Join
        </button>
        <button className={classes.button} onClick={handleIgnore}>
          Ignore
        </button>
      </div>
    </div>
  );
};

export default Invitation;
