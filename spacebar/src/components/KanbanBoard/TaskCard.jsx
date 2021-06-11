import {
  Card,
  CardActions,
  CardHeader,
  fade,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { deleteKanbanBoardItem } from "../../FireStore";
import MemberAvatar from "../MemberAvatar";
import PriorityIcon from "./PriorityIcon";
import TaskWindow from "./TaskWindow";

const useStyles = makeStyles((theme) => ({
  card: {
    background: theme.palette.secondary.main,
    "&:hover": {
      background: fade(theme.palette.secondary.main, 0.8),
    },
    margin: theme.spacing(1, 0),
  },
  cardHeader: {
    margin: theme.spacing(0),
  },
  cardContent: {
    display: "flex",
    justifyContent: "flex-end",
    margin: theme.spacing(-2, 0, 0, 0),
  },
  cardIconButton: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function TaskCard({ task, listId, members, index }) {
  const { projectID } = useParams();
  const classes = useStyles();
  const [isWindowOpen, setIsWindowOpen] = useState(false);

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
                className={classes.cardHeader}
                action={
                  <IconButton size="small" onClick={handleMoreMenuClick}>
                    <MoreHorizIcon />
                  </IconButton>
                }
                title={task.title}
                titleTypographyProps={{ variant: "body1" }}
              />
              <CardActions className={classes.cardContent} disableSpacing>
                <PriorityIcon variant={task.priority} />
                <MemberAvatar assignee={members[task.assignee]} />
              </CardActions>
            </Card>
          </div>
        )}
      </Draggable>
      <TaskWindow
        task={task}
        members={members}
        open={isWindowOpen}
        onClose={handleWindowClose}
      />
    </>
  );
}
