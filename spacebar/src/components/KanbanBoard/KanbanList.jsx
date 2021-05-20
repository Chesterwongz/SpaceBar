import React, { useState } from "react";
import { Paper, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import ItemCard from "../ItemCard.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    width: "240px",
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1, 1, 1, 1),
    margin: theme.spacing(1),
  },
  item: {
    margin: theme.spacing(1, 0),
  },
  addCard: {
    width: "100%",
  },
}));

export default function KanbanList() {
  const items = [
    {
      id: 1,
      title: "Task 1",
    },
    {
      id: 2,
      title: "Task 2",
    },
    {
      id: 3,
      title: "Task 3",
    },
    {
      id: 4,
      title: "Task 4",
    },
    {
      id: 5,
      title: "Task 5",
    },
  ]; // placeholders

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6">Todo</Typography>
        {items.map((item) => (
          <div className={classes.item}>
            <ItemCard item={item} />
          </div>
        ))}
        <Button className={classes.addCard}>+ Add Card</Button>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h6">Doing</Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h6">Done</Typography>
      </Paper>
    </div>
  );
}
