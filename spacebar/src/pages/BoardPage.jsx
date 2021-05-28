import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import { db } from "../FireStore";

export default function BoardPage() {
  const { projectID } = useParams();
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [listIds, setListIds] = useState([]);
  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .collection("kanbanboard")
      .onSnapshot((querySnapshot) => {
        const boardListIds = [];
        const boardLists = querySnapshot.docs
          .map((doc) => {
            boardListIds.push(doc.id);
            return doc.data();
          })
          .reduce((rest, item) => {
            return {
              ...rest,
              [item.id]: item, // item.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(boardLists);
        setListIds(boardListIds);
      });
    setLoading(false);
  }, [projectID]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    // console.log("dest", destination, "src", source, draggableId);
    if (!destination) return;

    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    const draggingCard = sourceList.items.filter(
      (item) => item.id === draggableId
    )[0];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggingCard);

    // update databse
    const batch = db.batch();
    const projectRef = db.collection("Projects").doc(projectID);
    const boardRef = projectRef.collection("kanbanboard");
    const srcRef = boardRef.doc(source.droppableId);
    batch.update(srcRef, { items: sourceList.items });
    const destRef = boardRef.doc(destination.droppableId);
    batch.update(destRef, { items: destinationList.items });
    batch.commit();
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
                return <KanbanBoard key={list.id} list={list} index={index} />;
              })}
          </div>
        </DragDropContext>
      )}
    </>
  );
}
