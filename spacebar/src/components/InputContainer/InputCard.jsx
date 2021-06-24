import { Button, IconButton, InputBase, Paper } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState, useContext } from "react";
import {
  addProject,
  addScrumProject,
  addScrumBoardTask,
  addKanbanBoardItem,
} from "../../FireStore";
import { useParams } from "react-router-dom";
import { CurrentUserContext } from "../../utils/Context";

const useStyle = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(1),
  },
  btnConfirm: {
    background: "#5AAC44",
    margin: theme.spacing(0, 1, 0, 0),
    color: "#fff",
    "&:hover": {
      background: fade("#5AAC44", 0.5),
    },
  },
  confirm: {
    display: "flex",
    justifyContent: "space-between",
    margin: theme.spacing(1, 0),
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

  const handleCardBtnConfirm = () => {
    !currentUser && console.log("Error! CurrentUser empty!", currentUser);
    if (type === "card") {
      addKanbanBoardItem(title, listId, currentUser, projectID);
    } else if (type === "backlog") {
      addScrumBoardTask(title, listId, currentUser, projectID);
    }
    setTitle("");
    setOpen(false);
  };
  const handleKanbanBtnConfirm = () => {
    addProject(title, currentUser);
  };
  const handleScrumBtnConfirm = () => {
    addScrumProject(title, currentUser);
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
              type === "card" || type === "backlog"
                ? "Enter a title of this card.."
                : type === "project"
                ? "Enter project title..."
                : "wrong type"
            }
          />
        </Paper>
      </div>
      <div className={classes.confirm}>
        {currentUser &&
          (type === "card" || type === "backlog" ? (
            <Button
              className={classes.btnConfirm}
              onClick={handleCardBtnConfirm}
            >
              Add Card
            </Button>
          ) : (
            <>
              <Button
                className={classes.btnConfirm}
                onClick={handleKanbanBtnConfirm}
              >
                Add Kanban Project
              </Button>
              <Button
                className={classes.btnConfirm}
                onClick={handleScrumBtnConfirm}
              >
                Add Scrum Project
              </Button>
            </>
          ))}
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </>
  );
}
