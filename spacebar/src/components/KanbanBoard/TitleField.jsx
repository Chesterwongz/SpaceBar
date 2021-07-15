import {
  InputBase,
  Paper,
  Typography,
  ClickAwayListener,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updateListTitle, updateScrumListTitle } from "../../FireStore";
import DeleteListDialog from "../InfoModals/DeleteListDialog";

const useStyle = makeStyles((theme) => ({
  editableTitleContainer: {
    padding: theme.spacing(0, 1),
    background: theme.palette.primary.main,
    display: "flex",
  },
  editableTitle: {
    flexGrow: 1,
    fontSize: "1.2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: fade("#000", 0.1),
    },
  },
  input: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: theme.spacing(0, 1),
    "&:focus": {
      background: "#fff",
    },
  },
}));

export default function TitleField({
  title,
  listID,
  lists,
  listIDs,
  sprintID,
}) {
  const { projectID } = useParams();
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const classes = useStyle();
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };
  const keyPress = (event) => {
    if (event.key === "Enter") {
      handleOnBlur();
    }
  };
  const handleOnBlur = () => {
    if (newTitle.length > 1) {
      if (sprintID) {
        updateScrumListTitle(newTitle, listID, projectID);
      } else {
        updateListTitle(newTitle, listID, projectID);
      }
    }
    setNewTitle(newTitle);
    setOpen(false);
  };

  return (
    <div>
      {open ? (
        <Paper elevation={0}>
          <ClickAwayListener onClickAway={handleOnBlur}>
            <InputBase
              onChange={handleOnChange}
              autoFocus
              value={newTitle}
              inputProps={{
                className: classes.input,
              }}
              fullWidth
              onBlur={handleOnBlur}
              onKeyPress={keyPress}
            />
          </ClickAwayListener>
        </Paper>
      ) : (
        <Paper elevation={0} className={classes.editableTitleContainer}>
          <Typography
            onClick={() => setOpen(!open)}
            className={classes.editableTitle}
          >
            {title}
          </Typography>
          <DeleteListDialog
            listID={listID}
            listIDs={listIDs}
            lists={lists}
            sprintID={sprintID}
          />
        </Paper>
      )}
    </div>
  );
}
