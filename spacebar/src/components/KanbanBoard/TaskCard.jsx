import {
  Card,
  CardActions,
  CardHeader,
  fade,
  IconButton,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import ArchiveIcon from "@material-ui/icons/Archive";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import {
  archiveKanbanBoardTask,
  archiveScrumBoardTask,
  deleteTask,
  unarchiveTask,
} from "../../FireStore";
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

export default function TaskCard({
  task,
  sprintID,
  listID,
  members,
  index,
  isScrum,
}) {
  const { projectID } = useParams();
  const classes = useStyles();
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const handleCardClick = () => {
    setIsWindowOpen(true);
  };
  const handleWindowClose = () => {
    setIsWindowOpen(false);
  };
  const handleDeleteTask = (event) => {
    event.stopPropagation();
    deleteTask(task.id, projectID);
  };
  const handleUnarchiveTask = (event) => {
    event.stopPropagation();
    unarchiveTask(task.id, projectID, isScrum);
  };
  const handleArchiveTask = (event) => {
    // Supposed to open a more menu, but now its just a delete.
    event.stopPropagation();
    if (sprintID) {
      archiveScrumBoardTask(task, sprintID, projectID);
    } else {
      archiveKanbanBoardTask(task, listID, projectID);
    }
  };

  return (
    <>
      {task.status === "Archived" ? (
        <Card className={classes.card} onClick={handleCardClick}>
          <CardHeader
            className={classes.cardHeader}
            action={
              <>
                <Tooltip title="Unarchive">
                  <IconButton size="small" onClick={handleUnarchiveTask}>
                    <UnarchiveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Forever">
                  <IconButton size="small" onClick={handleDeleteTask}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </>
            }
            title={task.title}
            titleTypographyProps={{ variant: "body1" }}
          />
          <CardActions className={classes.cardContent} disableSpacing>
            <PriorityIcon variant={task.priority} />
            <MemberAvatar assignee={members[task.assignee]} />
          </CardActions>
        </Card>
      ) : (
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
                    <Tooltip title="Archive">
                      <IconButton size="small" onClick={handleArchiveTask}>
                        <ArchiveIcon />
                      </IconButton>
                    </Tooltip>
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
      )}
      <TaskWindow
        task={task}
        members={members}
        sprintID={sprintID}
        open={isWindowOpen}
        onClose={handleWindowClose}
      />
    </>
  );
}
