import React from "react";
import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1, 0),
  },
}));

export default function Note({ item }) {
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
