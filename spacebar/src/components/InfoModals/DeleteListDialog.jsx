import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { deleteList, moveTask } from "../../FireStore";

const useStyle = makeStyles((theme) => ({
  uppercase: {
    textTransform: "uppercase",
  },
  deleteButton: {
    background: red["A400"],
    color: "#fff",
  },
}));

export default function DeleteListDialog({ listID, listIDs, lists }) {
  const classes = useStyle();
  const { projectID } = useParams();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newList, setNewList] = useState("");

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setNewList("");
    setOpen(false);
  };
  const handleDelete = () => {
    if (newList) {
      lists[listID].items.forEach((task) => {
        moveTask(task, listID, newList, projectID);
      });
      deleteList(listID, projectID);
    }
    setOpen(false);
  };
  return (
    <div>
      <IconButton size="small" onClick={handleClickOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Move work from{" "}
          <span className={classes.uppercase}>{lists[listID].title}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select a new home for any work with the current status, including
            work in the backlog.
          </DialogContentText>
          <div>
            <Typography variant="subtitle2"> &nbsp; Move To: </Typography>
            <Button
              variant="contained"
              onClick={handleMenuClick}
              disableElevation
            >
              {newList ? lists[newList].title : "Select destination"}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {listIDs.map((listId, index) => {
                if (listId !== listID && lists[listId]) {
                  return (
                    <MenuItem
                      key={index}
                      className={classes.uppercase}
                      onClick={() => {
                        setNewList(listId);
                        handleMenuClose();
                      }}
                    >
                      {lists[listId].title}
                    </MenuItem>
                  );
                }
              })}
            </Menu>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            onClick={handleDelete}
            className={classes.deleteButton}
            disabled={newList ? false : true}
          >
            Delete
          </Button>
          <Button variant="contained" disableElevation onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
