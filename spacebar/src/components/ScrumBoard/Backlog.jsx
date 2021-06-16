import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import InputContainer from "../InputContainer";
import TaskCard from "../KanbanBoard/TaskCard.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    width: "45%",
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

export default function Backlog({ list, lists, listIds, tasks, members }) {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h6">Backlog</Typography>
        <Droppable droppableId={"backlog"}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.tasks.map(
                (taskId, index) =>
                  tasks.taskId && (
                    <TaskCard
                      key={taskId}
                      task={tasks.taskId}
                      listId={list.id}
                      members={members}
                      index={index}
                    />
                  )
              )}
              <div className={classes.item}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        {/* <InputContainer listId={list.id} listTitle={list.title} type="card" /> */}
      </Paper>
    </div>
  );
}
