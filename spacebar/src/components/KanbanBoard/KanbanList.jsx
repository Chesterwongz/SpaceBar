import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import InputContainer from "../InputContainer";
import TaskCard from "./TaskCard.jsx";

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
  addItem: {
    width: "100%",
  },
}));

export default function KanbanList({ list, tasks, members, sprintID, sprint }) {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h6">{list.title}</Typography>
        <Droppable droppableId={list.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.items.map(
                (taskID, index) =>
                  tasks[taskID] && (
                    <TaskCard
                      key={taskID}
                      task={tasks[taskID]}
                      listID={list.id}
                      sprintID={sprintID}
                      members={members}
                      index={index}
                    />
                  )
              )}
              <div className={classes.item}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        {!sprint && <InputContainer listId={list.id} type="card" />}
      </Paper>
    </div>
  );
}
