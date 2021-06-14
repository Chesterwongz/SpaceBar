import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import EditableTitle from "../../CardWindow/EditableTitle";
import TaskAssigneeButton from "./TaskAssigneeButton";
import TaskComments from "./TaskComments";
import TaskPriorityButton from "./TaskPriorityButton";
import TaskStatusButton from "./TaskStatusButton";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    overflow: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    margin: "auto",
    padding: theme.spacing(2, 4, 3),
    width: "80%",
  },
  description: {
    margin: theme.spacing(0, 0, 2),
  },
  leftFields: {
    flexGrow: 4,
  },
  rightFields: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
  },
  delete: {
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
  },
  taskWindowBar: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default function TaskWindow({
  task,
  members,
  lists,
  listIds,
  open,
  onClose,
}) {
  const classes = useStyles();
  const [descValue, setDescValue] = useState("");

  const handleDescChange = (event) => {
    setDescValue(event.target.value);
    event.preventDefault();
  };

  const handleDelete = (event) => {
    event.preventDefault();
    // onDelete(docID);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.paper}>
            <div className={classes.leftFields}>
              <EditableTitle title={task.title} docID={task.id} type="task" />
              <TextField
                className={classes.description}
                id="outlined-textarea"
                label="Description"
                placeholder="Add a description..."
                multiline
                fullWidth
                variant="outlined"
                value={descValue}
                onChange={handleDescChange}
                InputLabelProps={{ shrink: true }}
              />
              <TaskComments />
            </div>
            <div className={classes.rightFields}>
              <div className={classes.taskWindowBar}>
                <Tooltip title="Close" placement="top">
                  <IconButton onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <List>
                <ListItem key={"status"} style={{ display: "flex" }}>
                  <ListItemText>Status:</ListItemText>
                  <TaskStatusButton
                    task={task}
                    lists={lists}
                    listIds={listIds}
                  />
                </ListItem>
                <ListItem key={"assignee"}>
                  <ListItemText>Assignee:</ListItemText>
                  <TaskAssigneeButton members={members} task={task} />
                </ListItem>
                <ListItem key={"priority"}>
                  <ListItemText>Priority:</ListItemText>
                  <TaskPriorityButton task={task} />
                </ListItem>
              </List>
            </div>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}
