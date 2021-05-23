import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import KanbanList from "../components/KanbanListv2.jsx";
import { db } from "../FireStore";

const lists = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Doing",
  },
  {
    id: "done",
    title: "Doing",
  },
];

export default function BoardPage() {
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("dest", destination, "src", source, draggableId);

    if (!destination) return;

    db.collection("boarditems")
      .doc(draggableId) // this assumes that card ids are unique!! we need to make cards added have unique ids!
      .update({ bucket: destination.droppableId });

    //TODO: some form of ordering
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex" }}>
        {lists.map((list, index) => {
          return <KanbanList key={list.id} list={list} index={index} />; // index prop is for dnd function
        })}
      </div>
    </DragDropContext>
  );
}
