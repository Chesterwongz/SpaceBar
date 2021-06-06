import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deleteKanbanBoardItem } from "../../FireStore";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1, 0),
  },
}));

export default function ItemCard({ item, listId, index }) {
  const { projectID } = useParams();
  const classes = useStyles();

  const handleMoreMenuClick = () => {
    // Supposed to open a more menu, but now its just a delete.
    // I'm thinking of placing all the db functions in one place.
    // I wonder if importing db and firebase whereever I need it is standard practice. It seems wrong
    deleteKanbanBoardItem(item, listId, projectID);
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
              titleTypographyProps={{ variant: "body1" }}
            />
          </Card>
        </div>
      )}
    </Draggable>
  );
}
