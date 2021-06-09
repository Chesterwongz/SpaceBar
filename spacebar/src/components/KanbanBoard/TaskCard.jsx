import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  fade,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { deleteKanbanBoardItem } from "../../FireStore";
import PriorityIcon from "./PriorityIcon";
import TaskWindow from "./TaskWindow";

const BRIGHTNESS_THRESHOLD = 164;

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const perceivedBrightness = (r * 299 + g * 587 + b * 114) / 1000;
  return perceivedBrightness >= BRIGHTNESS_THRESHOLD ? "black" : "white";
}

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
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: (props) => props.backgroundColor,
  },
  avatarName: {
    fontSize: "0.7rem",
    fontWeight: theme.typography.fontWeightMedium,
    color: (props) => getContrastYIQ(props.backgroundColor),
  },
}));

const getInitials = (string) => {
  var names = string.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export default function TaskCard({ task, listId, members, index }) {
  const assignee = members[task.assignee];
  const { projectID } = useParams();
  const classes = useStyles(assignee);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const assigneeInitials = assignee
    ? assignee.displayName
      ? getInitials(assignee.displayName)
      : ""
    : "";

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
                <Tooltip title={assigneeInitials}>
                  <Avatar
                    className={classes.avatar}
                    src="/linktouserprofilepic"
                  >
                    {assignee && (
                      <Typography className={classes.avatarName}>
                        {assigneeInitials}
                      </Typography>
                    )}
                  </Avatar>
                </Tooltip>
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
