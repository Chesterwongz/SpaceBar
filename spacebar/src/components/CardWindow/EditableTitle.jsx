import React, { useState, useEffect, useRef } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import { IconButton, InputBase, Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import { updatePostTitle, updateTaskTitle } from "../../FireStore";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(1),
    "&:hover": {
      background: fade("#808080", 0.1),
    },
  },
  editing: {
    padding: theme.spacing(1),
    border: "2px solid",
    borderColor: theme.palette.primary.main,
  },
  input: {
    fontSize: "1.7rem",
  },
}));

export default function EditableTitle({ title, docID, type }) {
  const classes = useStyles();
  const inputArea = useRef();
  const buttonArea = useRef();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [initialValue, setInitialValue] = useState("");
  let { projectID } = useParams();

  useEffect(() => {
    if (editing) {
      document.addEventListener("mousedown", handleClick);
    }
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [editing]);

  const handleClick = (e) => {
    if (
      inputArea.current.contains(e.target) ||
      buttonArea.current.contains(e.target)
    ) {
      // inside click
      return;
    }
    // outside click
    cancelEditing();
  };
  const keyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const handleEditing = () => {
    setEditing(true);
    setInitialValue(value);
  };
  const cancelEditing = () => {
    setEditing(false);
    setValue(initialValue);
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = () => {
    if (value !== initialValue) {
      if (type === "task") {
        updateTaskTitle(docID, value, projectID);
      } else if (type === "post") {
        updatePostTitle(docID, value, projectID);
      }
    }
    setEditing(false);
  };

  return (
    <>
      <Paper
        ref={inputArea}
        className={editing ? classes.editing : classes.title}
        elevation={0}
      >
        <InputBase
          className={classes.input}
          value={value}
          required
          multiline
          fullWidth
          readOnly={!editing}
          onChange={handleChange}
          onKeyPress={keyPress}
          onClick={handleEditing}
        />
      </Paper>
      <div ref={buttonArea}>
        {editing ? (
          <div>
            <IconButton onClick={handleSubmit} style={{ color: green[500] }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={cancelEditing} style={{ color: red[500] }}>
              <CancelIcon />
            </IconButton>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
