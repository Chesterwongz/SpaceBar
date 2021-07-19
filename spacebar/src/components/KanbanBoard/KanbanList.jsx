import {
  makeStyles,
  Paper,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
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
  infoCard: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, 1, -2),
    textAlign: "center",
  },
}));

export default function KanbanList({
  list,
  lists,
  listIDs,
  tasks,
  members,
  sprintID,
  index,
}) {
  const classes = useStyles();

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Paper className={classes.paper}>
            <TitleField
              title={list.title}
              listID={list.id}
              listIDs={listIDs}
              lists={lists}
              sprintID={sprintID}
            />
            <Droppable droppableId={list.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {list.items.length < 1 ? (
                    <Card elevation={0} className={classes.infoCard}>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          Drag items here
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    list.items.map(
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
                    )
                  )}
                  <div className={classes.item}>{provided.placeholder}</div>
                </div>
              )}
            </Droppable>
            {!sprintID && <InputContainer listID={list.id} type="card" />}
          </Paper>
        </div>
      )}
    </Draggable>
  );
}
