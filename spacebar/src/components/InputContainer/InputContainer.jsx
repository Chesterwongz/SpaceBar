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
      backgroundColor: fade("#000", 0.1),
    },
  },
  addProject: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: fade("#000", 0.1),
    },
  },
}));

export default function InputContainer({ listID, type, sprint }) {
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
        {open && (
          <InputCard
            setOpen={setOpen}
            listID={listID}
            type={type}
            sprint={sprint}
          />
        )}
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
              : type === "list"
              ? "+ Add another List"
              : type === "project"
              ? "+ Add a Project"
              : "Wrong Type"}
          </Typography>
        </Paper>
      </Collapse>
    </div>
  );
}
