import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import WarningIcon from "@material-ui/icons/Warning";

export default function DeleteTaskDialog({ onDelete }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <IconButton size="small" onMouseDown={handleClickOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <WarningIcon style={{ color: red["A400"] }} />
          {"Delete this task?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to permanently delete this task and all of its data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Delete
          </Button>
          <Button onMouseDown={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
