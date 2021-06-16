import {
  makeStyles,
  Paper,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import InputContainer from "../InputContainer";
import TaskCard from "../KanbanBoard/TaskCard.jsx";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { deleteSprint } from "../../FireStore";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    justifyContent: "space-between",
  },
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

export default function Sprint({ list, lists, listIds, tasks, members }) {
  const classes = useStyles();
  const { projectID } = useParams();

  const handleDeleteSprint = () => {
    deleteSprint(list.id, projectID);
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <div className={classes.title}>
          <Typography variant="h6">{list.title}</Typography>
          <Button>Start Sprint</Button>
          <IconButton edge="end" size="small" onClick={handleDeleteSprint}>
            <DeleteForeverIcon />
          </IconButton>
        </div>
        <Droppable droppableId={list.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.tasks.map(
                (taskId, index) =>
                  tasks[taskId] && (
                    <TaskCard
                      key={taskId}
                      task={tasks[taskId]}
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
        <InputContainer listId={list.id} listTitle={list.title} type="card" />
      </Paper>
    </div>
  );
}
