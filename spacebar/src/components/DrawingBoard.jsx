import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Masonry from "react-masonry-css";
import Note from "./Note.jsx";
import { getDrawingBoardItems, addDrawingBoardItem } from "../FireStore";
import { useState, useEffect, useContext, useCallback } from "react";
import { CurrentUserContext } from "../utils/Context";
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

    // add the logic to get notes by 
    const getNotes = useCallback(() => {  
      if (currentUser) {
        setLoading(true);  
        getDrawingBoardItems(currentUser.id)
          .then(items => {
            setdrawingboarditems(items);
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          })
      }
    }, [currentUser]);

  // create the submit handler
  const handleSubmit = value => {
    addDrawingBoardItem(currentUser.id, value)
      .then(getNotes); // after adding a note update the items
  }

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      {loading == false ? (
        <Container>
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {drawingboarditems.map((item) => (
              <div>
                <Note item={item} />
              </div>
            ))}
            <Note form onSubmit={handleSubmit}/>
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
