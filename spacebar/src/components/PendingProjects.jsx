import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Invitation from "./Invitation";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "20vw",
    height: "70vh",
    backgroundColor: theme.palette.primary.light,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "10px 10px",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: 900,
  },
}));

const PendingProjects = ({ pendingProjects, currentUserID }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <p className={classes.header}>
        You have the following project invitations:
      </p>
      {pendingProjects.map((projectID, index) => (
        <div key={index}>
          <Invitation projectID={projectID} currentUserID={currentUserID} />
        </div>
      ))}
    </div>
  );
};

export default PendingProjects;
