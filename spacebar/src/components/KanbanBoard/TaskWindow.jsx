import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton, Paper, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditableTitle from "../CardWindow/EditableTitle";

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
    width: "60%",
  },
  description: {
    margin: theme.spacing(0, 0, 2),
  },
  delete: {
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function TaskWindow({ docID, taskData, open, onClose }) {
  const classes = useStyles();

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
            <div>
              <EditableTitle title={taskData.title} docID={docID} type="task" />
              <TextField
                className={classes.description}
                id="outlined-textarea"
                label="Description"
                placeholder="Add a description..."
                multiline
                fullWidth
                variant="outlined"
              />
              <div>Comments:</div>
            </div>
            <div>Label</div>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}
