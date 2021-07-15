import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyle = makeStyles((theme) => ({
  deleteBtn: {
    background: red["A400"],
    color: "#fff",
  },
}));

export default function AlertDialog({
  open,
  setOpen,
  title,
  content,
  onDelete,
}) {
  const classes = useStyle();
  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disableElevation
          onClick={handleDelete}
          className={classes.deleteBtn}
        >
          Delete
        </Button>
        <Button variant="contained" disableElevation onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
