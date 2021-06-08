import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardHeader,
  IconButton,
  fade,
  makeStyles,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { db, deleteKanbanBoardItem } from "../../FireStore";
import { useParams } from "react-router-dom";
import TaskWindow from "./TaskWindow";

const useStyles = makeStyles((theme) => ({
  card: {
    background: theme.palette.secondary.main,
    "&:hover": {
      background: fade(theme.palette.secondary.main, 0.8),
    },
    margin: theme.spacing(1, 0),
  },
}));

export default function TaskCard({ task, listId, index }) {
  const { projectID } = useParams();
  const classes = useStyles();
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  // TODO: find a way to stop the flicker

  const handleCardClick = () => {
    setIsWindowOpen(true);
  };

  const handleWindowClose = () => {
    setIsWindowOpen(false);
  };

  const handleMoreMenuClick = () => {
    // Supposed to open a more menu, but now its just a delete.
    deleteKanbanBoardItem(task, listId, projectID);
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <Card className={classes.card} onClick={handleCardClick}>
              <CardHeader
                action={
                  <IconButton onClick={handleMoreMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={task.title}
                titleTypographyProps={{ variant: "body1" }}
              />
            </Card>
          </div>
        )}
      </Draggable>
      <TaskWindow task={task} open={isWindowOpen} onClose={handleWindowClose} />
    </>
  );
}
