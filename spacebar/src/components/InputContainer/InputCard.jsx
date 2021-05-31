import { Button, IconButton, InputBase, Paper } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState, useContext } from "react";
import { db } from "../../FireStore";
import firebase from "firebase";
import uuid from "react-uuid";
import { useParams } from "react-router-dom";
import { CurrentUserContext } from "../../utils/Context";

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

export default function InputCard({ setOpen, listId, type }) {
  const currentUser = useContext(CurrentUserContext);
  const { projectID } = useParams();
  const classes = useStyle();
  const [title, setTitle] = useState("");

  const addMoreCard = (title, listId) => {
    db.collection("Projects")
      .doc(projectID)
      .collection("kanbanboard")
      .doc(listId)
      .update({
        items: firebase.firestore.FieldValue.arrayUnion({
          id: `${uuid()}`,
          title: title,
        }),
      });
  };

  const addProject = (title) => {
    const id = uuid();
    const batch = db.batch();
    const projectRef = db.collection("Projects").doc(id);
    batch.set(projectRef, {
      projectInfo: { title: title },
    });
    const drawingBoardref = projectRef.collection("drawingboard").doc();
    batch.set(drawingBoardref, {
      title: "Be the first to initiate a discussion!",
      userID: `${currentUser.id}`,
    });
    const lists = [
      {
        id: `list-1`,
        title: "Todo",
        items: [],
      },
      {
        id: `list-2`,
        title: "Doing",
        items: [],
      },
      {
        id: `list-3`,
        title: "Done",
        items: [],
      },
    ];
    lists.forEach((doc) => {
      const listRef = projectRef.collection("kanbanboard").doc(doc.id);
      batch.set(listRef, doc);
    });
    const userRef = db.collection("users").doc(currentUser.id);
    batch.update(userRef, {
      projectRef: firebase.firestore.FieldValue.arrayUnion(id),
    });
    batch.commit();
  };

  const handleOnChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBtnConfirm = () => {
    if (type === "card") {
      addMoreCard(title, listId);
    } else if (type === "project") {
      addProject(title);
    }
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
            placeholder={
              type === "card"
                ? "Enter a title of this card.."
                : type === "project"
                ? "Enter project title..."
                : "wrong type"
            }
          />
        </Paper>
      </div>
      <div className={classes.confirm}>
        {currentUser && (
          <Button className={classes.btnConfirm} onClick={handleBtnConfirm}>
            {type === "card"
              ? "Add Card"
              : type === "project"
              ? "Add Project"
              : "Wrong type"}
          </Button>
        )}
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </>
  );
}
