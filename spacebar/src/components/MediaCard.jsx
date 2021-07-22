import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { db, deleteProject } from "../FireStore";
import { useState, useEffect } from "react";
import AlertDialog from "./InfoModals/AlertDialog";
import Rocket from "../images/rocket.jpg";

const useStyles = makeStyles({
  root: {
    width: 300,
    marginBottom: 16,
  },
  media: {
    height: 160,
  },
  action: {
    display: "flex",
    justifyContent: "space-between",
  },
  deleteBtn: {
    marginLeft: "auto",
  },
});

export default function MediaCard({ projectRef }) {
  const classes = useStyles();
  const [projectInfo, setProjectInfo] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const link = `/${projectRef}/board`;
  const handleDelete = () => {
    deleteProject(projectRef);
  };
  const handleClick = () => {
    setAlertOpen(true);
  };
  useEffect(() => {
    db.collection("Projects")
      .doc(projectRef)
      .get()
      .then((doc) => {
        setProjectInfo(doc.data().projectInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [projectRef]);

  return (
    <Card className={classes.root}>
      <CardActionArea href={link}>
        <CardMedia className={classes.media} image={Rocket} title="Spaceship" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {projectInfo.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.action}>
        <Button size="small" color="primary" href={link}>
          View Project
        </Button>
        <IconButton
          className={classes.deleteBtn}
          size="small"
          onClick={handleClick}
        >
          <DeleteForeverIcon color="primary" />
        </IconButton>
      </CardActions>
      <AlertDialog
        open={alertOpen}
        setOpen={setAlertOpen}
        title={`Delete ${projectInfo.title}?`}
        content="The project along with its issues, discussions, and components will be permanently deleted."
        onDelete={handleDelete}
      />
    </Card>
  );
}
