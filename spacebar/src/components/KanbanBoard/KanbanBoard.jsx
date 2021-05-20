import React from "react";
import KanbanList from "./KanbanList.jsx";
import { makeStyles } from "@material-ui/core";

const items = [
  {
    id: 1,
    title:
      "What is the difference between .js and .jsx? Which should we use? Is there even a difference???????",
  },
  {
    id: 2,
    title: "Should we gitignore the node_modules folder?",
  },
  {
    id: 3,
    title: "Should zombies have human rights?",
  },
  {
    id: 4,
    title: "We have too much work!!",
  },
  {
    id: 5,
    title: "Where do Astronauts hangout? In the Space Bar!",
  },
]; // placeholders

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

export default function KanbanBoard() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {items.map((item) => (
        <KanbanList />
      ))}
    </div>
  );
}
