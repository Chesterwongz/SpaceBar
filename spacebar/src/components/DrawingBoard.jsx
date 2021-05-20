import { Container } from "@material-ui/core";
import React from "react";
import Masonry from "react-masonry-css";
import ItemCard from "./ItemCard.jsx";

export default function DrawingBoard() {
  const items = [
    {
      id: 1,
      title:
        "What is the difference between .js and .jsx? Which should we use? Is there even a difference???????",
    },
    {
      id: 2,
      title: "Should we gitignore the node_modules folder?",
    },
    {
      id: 3,
      title: "Should zombies have human rights?",
    },
    {
      id: 4,
      title: "We have too much work!!",
    },
    {
      id: 5,
      title: "Where do Astronauts hangout? In the Space Bar!",
    },
  ]; // placeholders

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
        {items.map((item) => (
          <div key={item.id}>
            <ItemCard item={item} />
          </div>
        ))}
      </Masonry>
    </Container>
    // TODO: Add create card function
  );
}
