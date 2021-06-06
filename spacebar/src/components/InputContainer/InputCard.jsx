import { Button, IconButton, InputBase, Paper } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState, useContext } from "react";
import { addProject, addKanbanBoardItem } from "../../FireStore";
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

  const handleOnChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBtnConfirm = () => {
    if (type === "card") {
      addKanbanBoardItem(title, listId, projectID);
    } else if (type === "project") {
      console.log("Adding project", currentUser);
      addProject(title, currentUser);
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
        {console.log(currentUser)}
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
