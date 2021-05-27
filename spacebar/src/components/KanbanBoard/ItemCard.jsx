import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { db } from "../../FireStore";
import firebase from "firebase";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1, 0),
  },
}));

export default function ItemCard({ item, listId, index }) {
  const { projectID } = useParams();
  const projectRef = db.collection("Projects").doc(projectID);
  const classes = useStyles();
  const handleMoreMenuClick = () => {
    // Supposed to open a more menu, but now its just a delete.
    // I'm thinking of placing all the db functions in one place.
    // I wonder if importing db and firebase whereever I need it is standard practice. It seems wrong
    projectRef
      .collection("kanbanboard")
      .doc(listId)
      .update({
        items: firebase.firestore.FieldValue.arrayRemove(item),
      });
  };
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Card className={classes.card}>
            <CardHeader
              action={
                <IconButton onClick={handleMoreMenuClick}>
                  <MoreVertIcon />
                </IconButton>
              }
              title={item.title}
            />
          </Card>
        </div>
      )}
    </Draggable>
  );
}
