import {
  Button,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState, useContext } from "react";
import {
  addProject,
  addScrumProject,
  addList,
  addScrumList,
  addKanbanBoardItem,
  addScrumBoardTask,
} from "../../FireStore";
import { useParams } from "react-router-dom";
import { CurrentUserContext } from "../../utils/Context";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
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

export default function InputCard({ setOpen, listID, type, sprint }) {
  const currentUser = useContext(CurrentUserContext);
  const { projectID } = useParams();
  const classes = useStyle();
  const [title, setTitle] = useState("");

  const handleOnChange = (event) => {
    setTitle(event.target.value);
  };
  const keyPress = (event) => {
    if (event.key === "Enter") {
      handleBtnConfirm();
      event.preventDefault();
      resetInput();
      return false;
    }
  };
  const resetInput = () => {
    setTitle("");
    setOpen(false);
  };
  const handleBtnConfirm = () => {
    if (title.length < 1) return;
    if (type === "card") {
      addKanbanBoardItem(title, listID, currentUser, projectID);
    } else if (type === "backlog") {
      addScrumBoardTask(title, listID, currentUser, projectID);
    } else if (type === "list") {
      if (sprint) {
        addScrumList(title, projectID);
      } else {
        addList(title, projectID);
      }
    } else {
      return;
    }
    resetInput();
  };
  const handleKanbanBtnConfirm = () => {
    if (title.length < 1) return;
    addProject(title, currentUser);
    resetInput();
  };
  const handleScrumBtnConfirm = () => {
    if (title.length < 1) return;
    addScrumProject(title, currentUser);
    resetInput();
  };
  return (
    <div className={classes.root}>
      <Paper>
        <InputBase
          onChange={handleOnChange}
          onKeyPress={keyPress}
          multiline
          fullWidth
          autoFocus
          inputProps={{
            className: classes.input,
          }}
          value={title}
          placeholder={
            type === "card" || type === "backlog"
              ? "Enter a title of this card.."
              : type === "list"
              ? "Enter list title..."
              : type === "project"
              ? "Enter project title..."
              : "wrong type"
          }
        />
      </Paper>
      <div className={classes.confirm}>
        {currentUser &&
          (type === "card" || type === "backlog" ? (
            <Button className={classes.btnConfirm} onClick={handleBtnConfirm}>
              Add Card
            </Button>
          ) : type === "list" ? (
            <Button className={classes.btnConfirm} onClick={handleBtnConfirm}>
              Add List
            </Button>
          ) : (
            <>
              <Tooltip
                title="Visualize and advance your project forward using issues on a powerful board."
                arrow
              >
                <Button
                  className={classes.btnConfirm}
                  onClick={handleKanbanBtnConfirm}
                >
                  Add Kanban Project
                </Button>
              </Tooltip>
              <Tooltip
                title="Sprint toward your project goals with a board, backlog, and roadmap."
                arrow
              >
                <Button
                  className={classes.btnConfirm}
                  onClick={handleScrumBtnConfirm}
                >
                  Add Scrum Project
                </Button>
              </Tooltip>
            </>
          ))}
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
}
