import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanList from "../components/KanbanList.jsx";
import { db } from "../FireStore";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function BoardPage() {
  const boardRef = db.collection("kanbanboard");
  //New database code
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [listIds, setListIds] = useState([]);
  useEffect(() => {
    boardRef
      .get()
      .then((querySnapshot) => {
        const boardListIds = [];
        const boardLists = querySnapshot.docs
          .map((doc) => {
            boardListIds.push(doc.id);
            return doc.data();
          })
          .reduce((rest, item) => {
            return {
              ...rest,
              [item.id]: item,
            };
          }, {});
        setLists(boardLists);
        setListIds(boardListIds);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    setLoading(false);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("dest", destination, "src", source, draggableId);
    if (!destination) return;

    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    const draggingCard = sourceList.items.filter(
      (item) => item.id === draggableId
    )[0];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggingCard);
    if (source.droppableId === destination.droppableId) {
      // drag and drop in same list
      const newState = {
        ...lists,
        [sourceList.id]: destinationList,
      };
      setLists(newState);
    } else {
      // drag and drop in different list
      const newState = {
        ...lists,
        [sourceList.id]: sourceList,
        [destinationList.id]: destinationList,
      };
      setLists(newState);
    }
    boardRef.doc(source.droppableId).update({ items: sourceList.items });
    boardRef
      .doc(destination.droppableId)
      .update({ items: destinationList.items });
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
            {listIds &&
              listIds.map((listId, index) => {
                const list = lists[listId];
                return <KanbanList key={list.id} list={list} index={index} />;
              })}
          </div>
        </DragDropContext>
      )}
    </>
  );
}
