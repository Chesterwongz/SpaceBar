import React, { useState } from "react";
import { db } from "../../FireStore";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton, TextField } from "@material-ui/core";

const DescriptionBox = ({ projectID, epicId, desc }) => {
  const [value, setValue] = useState(desc);
  const [editing, setEditing] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .doc(epicId)
      .update({
        description: value,
      });
    setEditing(false);
  };
  const openEditing = () => {
    setEditing(true);
  };
  const cancelEditing = () => {
    setEditing(false);
  };
  return (
    <div>
      <TextField
        id="filled-multiline-static"
        label="Add a description"
        multiline
        value={value}
        rows={4}
        variant="filled"
        onChange={handleChange}
        onClick={openEditing}
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
};

export default DescriptionBox;
