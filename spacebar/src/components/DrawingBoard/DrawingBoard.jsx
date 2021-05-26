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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function DrawingBoard() {
  const [drawingboarditems, setdrawingboarditems] = useState([]);
  const currentUser = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  useEffect(() => {
    if (currentUser) {
      var unSubscribe = db
        .collection("drawingboarditems")
        .where("userID", "==", currentUser.id)
        .onSnapshot((querySnapshot) => {
          var items = [];
          querySnapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setdrawingboarditems(items);
          setLoading(false);
        });
      return () => {
        unSubscribe();
      };
    }
  }, [currentUser]);

  const handleDelete = (docID) => {
    deleteDrawingBoardItem(docID);
  };

  const handleSubmit = (value) => {
    addDrawingBoardItem(currentUser.id, value);
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
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {drawingboarditems.map((item) => (
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
