import React from "react";
import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../FireStore.js";
import ItemCard from "./ItemCardv2.jsx";

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

  const itemsRef = db.collection("boarditems");
  const query = itemsRef.where("bucket", "==", list.id); // query items in the list, I want to change "bucket" into 'status' once firebase is back up
  const [items, loading, error] = useCollectionData(query, { idField: "id" });
  const handleOnClick = () => {
    console.log(items);
  };
  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h6">{list.title}</Typography>
        <Droppable droppableId={list.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {error && <strong>Error: {JSON.stringify(error)}</strong>}
              {loading && <span>Collection: Loading...</span>}
              {items &&
                items.map((item, index) => (
                  <ItemCard key={item.id} item={item} index={index} />
                ))}
              <div className={classes.item}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>

        <Button className={classes.addItem} onClick={handleOnClick}>
          + Add Item
        </Button>
      </Paper>
    </div>
  );
}
