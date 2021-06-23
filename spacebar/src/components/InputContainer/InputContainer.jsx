import React, { useState } from "react";
import { Paper, Typography, Collapse } from "@material-ui/core";
import { makeStyles, fade } from "@material-ui/core/styles";
import InputCard from "./InputCard.jsx";

const useStyle = makeStyles((theme) => ({
  cardRoot: {
    marginTop: theme.spacing(1),
  },
  projectRoot: {},
  addCard: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: fade("#000", 0.25),
    },
  },
  addProject: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: fade("#000", 0.25),
    },
  },
}));

export default function InputContainer({ listId, type }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  return (
    <div
      className={
        type === "card" || type === "backlog"
          ? classes.cardRoot
          : classes.projectRoot
      }
    >
      <Collapse in={open}>
        <InputCard setOpen={setOpen} listId={listId} type={type} />
      </Collapse>
      <Collapse in={!open}>
        <Paper
          className={
            type === "card" || type === "backlog"
              ? classes.addCard
              : classes.addProject
          }
          elevation={0}
          onClick={() => setOpen(!open)}
        >
          <Typography>
            {type === "card" || type === "backlog"
              ? "+ Add a Card"
              : type === "project"
              ? "+ Add a Project"
              : "Wrong Type"}
          </Typography>
        </Paper>
      </Collapse>
    </div>
  );
}
