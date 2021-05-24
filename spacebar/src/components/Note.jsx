import React from "react";
import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Form from "./Form";
import CardWindow from "./CardWindow"; 

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1, 0),
  },
}));

export default function Note({ item, form, onSubmit  }) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      {form ? (
        <Form onSubmit={onSubmit}/>
      ) : (
        <CardHeader
          action={
            <CardWindow/>
          }
          title={item.title}
        />
      )}
    </Card>
  );
}
