import { Container } from "@material-ui/core";
import React from "react";
import Masonry from "react-masonry-css";
import Note from "./Note.jsx";
import {db} from "../FireStore"; 
import {useState, useEffect, useContext} from 'react'; 
import {CurrentUserContext} from "../utils/Context";

export default function DrawingBoard() {

  const [drawingboarditems, setdrawingboarditems] = useState([]); 
  const currentUser = useContext(CurrentUserContext); 

  useEffect(() => {
    if (currentUser) {
      const items = []; 
      db.collection("drawingboarditems")
      .where("userID", "==", currentUser.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          items.push({
            id: doc.id, 
            ...doc.data()
          })
        })
        setdrawingboarditems(items);
      })
    }
  }, [currentUser])

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Container>
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {drawingboarditems.map((item) => (
          <div key={item.id}>
            <Note item={item} />
          </div>
        ))}
      </Masonry>
    </Container>
    // TODO: Add create card function
  );
}
