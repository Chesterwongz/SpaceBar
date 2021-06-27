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

  const resetInput = () => {
    setTitle("");
    setOpen(false);
  };
  const handleCardBtnConfirm = () => {
    if (title.length < 1) return;
    if (type === "card") {
      addKanbanBoardItem(title, listId, currentUser, projectID);
    } else if (type === "backlog") {
      addScrumBoardTask(title, listId, currentUser, projectID);
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
    </>
  );
}
