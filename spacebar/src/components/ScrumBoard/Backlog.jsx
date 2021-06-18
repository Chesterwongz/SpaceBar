import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import InputContainer from "../InputContainer";
import TaskCard from "../KanbanBoard/TaskCard.jsx";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
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

export default function Backlog({ list, tasks, members }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6">Backlog</Typography>
        <Droppable droppableId={"backlog"}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.items.map(
                (taskId, index) =>
                  tasks[taskId] && (
                    <TaskCard
                      key={taskId}
                      task={tasks[taskId]}
                      sprintID={list.id}
                      members={members}
                      index={index}
                    />
                  )
              )}
              <div className={classes.item}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        <InputContainer
          listId={"backlog"}
          listTitle={"Backlog"}
          type="backlog"
        />
      </Paper>
    </div>
  );
}
