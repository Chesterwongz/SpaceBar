import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ItemCard from "./ItemCard.jsx";
import AddItemContainer from "./AddItemContainer.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    width: "240px",
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1, 1, 1, 1),
    margin: theme.spacing(1),
  },
  item: {
    margin: theme.spacing(1, 0),
  },
  addItem: {
    width: "100%",
  },
}));

export default function KanbanList({ list }) {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h6">{list.title}</Typography>
        <Droppable droppableId={list.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.items.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  listId={list.id}
                  index={index}
                />
              ))}
              <div className={classes.item}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        <AddItemContainer listId={list.id} />
      </Paper>
    </div>
  );
}
