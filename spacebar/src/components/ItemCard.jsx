import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function ItemCard({ item }) {
  const classes = useStyles();
  return (
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
  );
}
