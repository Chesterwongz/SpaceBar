import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import store from "../utils/store.js";
import KanbanList from "../components/KanbanBoard/KanbanList.jsx";

export default function BoardPage() {
  const [data, setData] = useState(store);
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggingCard = sourceList.items.filter(
      (item) => item.id === draggableId
    )[0];

    if (source.droppableId === destination.droppableId) {
      sourceList.items.splice(source.index, 1);
      destinationList.items.splice(destination.index, 0, draggingCard);
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList,
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
