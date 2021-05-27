import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { db } from "../FireStore";
import { useState, useEffect } from "react";
import Rocket from "../images/rocket.jpg"

const useStyles = makeStyles({
  root: {
    maxWidth: 310,
  },
  media: {
    height: 160,
  },
});

export default function MediaCard({ projectref }) {
  const classes = useStyles();
  const [projectInfo, setProjectInfo] = useState({});
  const link = `/${projectref}/board`;

  useEffect(() => {
    db.collection("Projects")
      .doc(projectref)
      .get()
      .then((doc) => {
        setProjectInfo(doc.data().projectInfo);
      });
  }, []);
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={Rocket}
          title="Spaceship"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {projectInfo.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" href={link}>
          View Project
        </Button>
      </CardActions>
    </Card>
  );
}
