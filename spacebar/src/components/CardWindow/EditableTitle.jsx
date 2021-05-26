import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import { updateDrawingBoardTitle } from "../FireStore";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import {  useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1.7rem",
    lineHeight: 1.4,
  },
}));
export default function EditableTitle({ title, docID }) {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  let {projectID} = useParams();

  const handleEditing = () => {
    setEditing(true);
  };
  const cancelEditing = () => {
    setEditing(false);
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = () => {
    updateDrawingBoardTitle(docID, value, projectID);
    cancelEditing();
  };
  return (
    <div>
      <TextField
        onClick={handleEditing}
        value={value}
        id="filled-multiline-flexible"
        variant="filled"
        multiline
        fullWidth
        InputProps={{
          classes: {
            input: classes.title,
          },
        }}
        onChange={handleChange}
      />
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
  );
}
