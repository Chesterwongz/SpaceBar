import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Masonry from "react-masonry-css";
import Note from "./Note.jsx";
import {
  db,
  addDrawingBoardItem,
  deleteDrawingBoardItem,
} from "../../FireStore";
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../utils/Context";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  masonryGrid: {
    display: "flex",
    marginLeft: theme.spacing(-2.5) /* gutter size offset */,
    width: "auto",
  },
  masonryGridColumn: {
    paddingLeft: theme.spacing(2.5) /* gutter size */,
    backgroundClip: "padding box",
  },
}));

export default function DrawingBoard() {
  const [drawingBoardItems, setDrawingBoardItems] = useState([]);
  const currentUser = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  let { projectID } = useParams();
  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .collection("drawingboard")
      .onSnapshot((querySnapshot) => {
        var items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setDrawingBoardItems(items);
        setLoading(false);
      });
  }, [projectID]);

  const handleDelete = (docID) => {
    deleteDrawingBoardItem(docID, projectID);
  };

  const handleSubmit = (value) => {
    addDrawingBoardItem(currentUser.id, value, projectID);
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      {loading === false ? (
        <Container>
          <Masonry
            breakpointCols={breakpoints}
            className={classes.masonryGrid}
            columnClassName={classes.masonryGridColumn}
          >
            {drawingBoardItems.map((item) => (
              <Note key={item.id} item={item} onDelete={handleDelete} />
            ))}
            <Note form onSubmit={handleSubmit} />
          </Masonry>
        </Container>
      ) : (
        <div className={classes.root}>
          <CircularProgress />
        </div>
      )}
    </>
  );
}
