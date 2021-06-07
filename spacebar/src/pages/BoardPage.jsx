import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import { db, updateKanbanBoardItems } from "../FireStore";

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
            boardListIds.push(doc.id); // array of lists in order of doc
            return doc.data();
          })
          .reduce((rest, list) => {
            return {
              ...rest,
              [list.id]: list, // item.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(boardLists);
        setListIds(boardListIds);
        setLoading(false);
      });
  }, [projectID]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    // const draggingCard = sourceList.items.filter(
    //   (taskId) => taskId === draggableId
    // )[0];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggableId);

    updateKanbanBoardItems(
      destination,
      source,
      sourceList,
      destinationList,
      draggableId,
      projectID
    );
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
