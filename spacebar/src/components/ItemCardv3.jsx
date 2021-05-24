import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1, 0),
  },
}));

export default function ItemCard({ item, index }) {
  const classes = useStyles();

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
                <IconButton>
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
