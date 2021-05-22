import React, { useState, useEffect, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import store from "../utils/store.js";
import KanbanList from "../components/KanbanList.jsx";
import { db } from "../FireStore";
import { CurrentUserContext } from "../utils/Context";

export default function BoardPage() {
  //New database code
  const [boarditems, setboarditems] = useState([]);
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    const items = [];
    if (currentUser) {
      db.collection("boarditems")
        .where("userID", "==", currentUser.id)
        .get()
        .then((query) => {
          query.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setboarditems(items);
        });
    }
  }, [currentUser]);
  //******************* */

  const [data, setData] = useState(store);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggingCard = sourceList.items.filter(
      (item) => item.id === draggableId
    )[0];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggingCard);
    if (source.droppableId === destination.droppableId) {
      // drag and drop in same list
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList,
        },
      };
      setData(newState);
    } else {
      // drag and drop in different list
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: sourceList,
          [destinationList.id]: destinationList,
        },
      };
      setData(newState);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex" }}>
        {data.listIds.map((listId, index) => {
          const list = data.lists[listId];
          return <KanbanList key={listId} list={list} index={index} />;
        })}
      </div>
    </DragDropContext>
  );
}
