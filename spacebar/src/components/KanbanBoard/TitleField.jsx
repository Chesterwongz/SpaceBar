import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updateListTitle } from "../../FireStore";
import { Typography, InputBase, Paper, IconButton } from "@material-ui/core";
import { makeStyles, fade } from "@material-ui/core/styles";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

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
export default function TitleField({ title, listID }) {
  const { projectID } = useParams();
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const classes = useStyle();
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleOnBlur = () => {
    updateListTitle(newTitle, listID, projectID);
    setOpen(false);
  };
  return (
    <div>
      {open ? (
        <Paper elevation={0}>
          <InputBase
            onChange={handleOnChange}
            autoFocus
            value={newTitle}
            inputProps={{
              className: classes.input,
            }}
            fullWidth
            onBlur={handleOnBlur}
          />
        </Paper>
      ) : (
        <Paper elevation={0} className={classes.editableTitleContainer}>
          <Typography
            onClick={() => setOpen(!open)}
            className={classes.editableTitle}
          >
            {title}
          </Typography>
          <IconButton size="small">
            <MoreHorizIcon />
          </IconButton>
        </Paper>
      )}
    </div>
  );
}
