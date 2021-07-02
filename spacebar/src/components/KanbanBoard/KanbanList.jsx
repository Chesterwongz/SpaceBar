import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import InputContainer from "../InputContainer";
import TaskCard from "./TaskCard.jsx";
import TitleField from "./TitleField";

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

export default function KanbanList({
  list,
  lists,
  listIDs,
  tasks,
  members,
  sprintID,
  sprint,
}) {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <TitleField title={list.title} listID={list.id} />
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
                      lists={lists}
                      listIDs={listIDs}
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
