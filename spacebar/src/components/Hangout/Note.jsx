import React from "react";
import { Card, CardHeader, makeStyles } from "@material-ui/core";
import Form from "../Form";
import CardWindow from "../CardWindow";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1, 0, 2.5),
  },
  header: {
    wordBreak: "break-word",
  },
}));

export default function Note({ item, form, onSubmit, onDelete }) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      {form ? (
        <Form onSubmit={onSubmit} placeHolder="Add item" />
      ) : (
        <CardHeader
          className={classes.header}
          action={
            <CardWindow
              docID={item.id}
              onDelete={onDelete}
              title={item.title}
            />
          }
          title={item.title}
          titleTypographyProps={{ variant: "body1" }}
        />
      )}
    </Card>
  );
}
