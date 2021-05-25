import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanList from "../components/KanbanList.jsx";
import { db } from "../FireStore";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function BoardPage() {
  const boardRef = db.collection("kanbanboard");
  //New database code
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  useEffect(() => {
    const boardLists = [];
    boardRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          boardLists.push(doc.data());
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    setLists(boardLists);
    setLoading(false);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("dest", destination, "src", source, draggableId);
    if (!destination) return;

    // const sourceList = source.droppableId;
    // const destinationList = destination.droppableId;
    // const draggingCard = sourceList.items.splice(source.index, 1);
    // destinationList.items.splice(destination.index, 0, draggingCard);
    // if (source.droppableId === destination.droppableId) {
    //   // drag and drop in same list
    //   const newState = {
    //     ...data,
    //     lists: {
    //       ...data.lists,
    //       [sourceList.id]: destinationList,
    //     },
    //   };
    //   setData(newState);
    // } else {
    //   // drag and drop in different list
    //   const newState = {
    //     ...data,
    //     lists: {
    //       ...data.lists,
    //       [sourceList.id]: sourceList,
    //       [destinationList.id]: destinationList,
    //     },
    //   };
    //   setData(newState);
    // }
  };
  return (
    <>
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: "flex" }}>
            {lists &&
              lists.map((list, index) => {
                return <KanbanList key={list.id} list={list} index={index} />;
              })}
          </div>
        </DragDropContext>
      )}
    </>
  );
}
