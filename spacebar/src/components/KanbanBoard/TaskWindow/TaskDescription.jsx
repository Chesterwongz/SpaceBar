import { IconButton, TextField } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import React, { useState } from "react";
import { updateTaskDesc } from "../../../FireStore";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  description: {
    margin: theme.spacing(0, 0, 2),
  },
}));

export default function TaskDescription({ taskId, value }) {
  const { projectID } = useParams();
  const classes = useStyles();
  const [desc, setDesc] = useState(value);
  const [editing, setEditing] = useState(false);

  const handleChange = (event) => {
    setEditing(true);
    setDesc(event.target.value);
  };

  const handleSubmit = () => {
    updateTaskDesc(taskId, desc, projectID);
    setEditing(false);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDesc(value);
  };

  return (
    <div>
      <TextField
        className={classes.description}
        id="outlined-textarea"
        label="Description"
        placeholder="Add a description..."
        multiline
        fullWidth
        variant="outlined"
        value={desc}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      {editing && (
        <div>
          <IconButton onClick={handleSubmit} style={{ color: green[500] }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={cancelEditing} style={{ color: red[500] }}>
            <CancelIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}
