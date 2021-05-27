import { Button, IconButton, InputBase, Paper } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState } from "react";
import { db } from "../../FireStore";
import firebase from "firebase";
import uuid from "react-uuid";
import { useParams } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(1),
  },
  btnConfirm: {
    background: "#5AAC44",
    color: "#fff",
    "&:hover": {
      background: fade("#5AAC44", 0.5),
    },
  },
  confirm: {
    margin: theme.spacing(1, 0, 0),
  },
}));

export default function AddItemCard({ setOpen, listId }) {
  const { projectID } = useParams();
  const classes = useStyle();
  const [title, setTitle] = useState("");
  const projectRef = db.collection("Projects").doc(projectID);

  const addMoreCard = (title, listId) => {
    projectRef
      .collection("kanbanboard")
      .doc(listId)
      .update({
        items: firebase.firestore.FieldValue.arrayUnion({
          id: `${uuid()}`,
          title: title,
        }),
      });
  };

  const handleOnChange = (event) => {
    setTitle(event.target.value);
  };
  const handleBtnConfirm = () => {
    addMoreCard(title, listId);
    setTitle("");
    setOpen(false);
  };

  return (
    <>
      <div>
        <Paper>
          <InputBase
            onChange={handleOnChange}
            multiline
            onBlur={() => setOpen(false)}
            fullWidth
            inputProps={{
              className: classes.input,
            }}
            value={title}
            placeholder={"Enter a title of this card.."}
          />
        </Paper>
      </div>
      <div className={classes.confirm}>
        <Button className={classes.btnConfirm} onClick={handleBtnConfirm}>
          {"Add Card"}
        </Button>
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </>
  );
}
