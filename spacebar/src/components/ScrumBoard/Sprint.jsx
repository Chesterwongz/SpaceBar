import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { completeSprint, deleteSprint, setSprint } from "../../FireStore";
import InputContainer from "../InputContainer";
import TaskCard from "../KanbanBoard/TaskCard.jsx";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    height: theme.spacing(4),
  },
  paper: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1, 1, 1, 1),
    margin: theme.spacing(1),
  },
  infoCard: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, 1, -2),
    textAlign: "center",
  },
  item: {
    margin: theme.spacing(1, 0),
  },
  addItem: {
    width: "100%",
  },
}));

export default function Sprint({ list, tasks, members, currentSprint }) {
  const classes = useStyles();
  const { projectID } = useParams();
  const handleDeleteSprint = () => {
    if (currentSprint === list.id) setSprint("", projectID);
    deleteSprint(list.id, list.items, projectID);
  };
  const handleStartSprint = () => {
    setSprint(list.id, projectID);
  };
  const handleCompleteSprint = () => {
    completeSprint(list.id, list.items, projectID);
  };
  return (
    <div>
      <Paper className={classes.paper}>
        <div className={classes.title}>
          <Typography variant="h6">{list.title}</Typography>
          {currentSprint === list.id ? (
            <Button className={classes.button} onClick={handleCompleteSprint}>
              Complete Sprint
            </Button>
          ) : (
            <Button
              className={classes.button}
              onClick={handleStartSprint}
              disabled={list.items.length < 1 || (currentSprint ? true : false)}
            >
              Start Sprint
            </Button>
          )}
          <IconButton edge="end" size="small" onClick={handleDeleteSprint}>
            <DeleteForeverIcon />
          </IconButton>
        </div>
        <Droppable droppableId={list.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.items.length < 1 ? (
                <Card elevation={0} className={classes.infoCard}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Plan a sprint by dragging a task from the backlog
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                list.items.map(
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
                )
              )}
              <div className={classes.item}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        <InputContainer listId={list.id} type="backlog" />
      </Paper>
    </div>
  );
}
