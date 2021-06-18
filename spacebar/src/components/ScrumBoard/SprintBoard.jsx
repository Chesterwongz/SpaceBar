import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import KanbanList from "../KanbanBoard/KanbanList.jsx";
import { db, updateKanbanBoardItems } from "../../FireStore";

export default function SprintBoard({ tasks, sprintId, members }) {
  const { projectID } = useParams();
  const [lists, setLists] = useState({});
  const [listIds, setListIds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .doc(sprintId)
      .collection("board")
      .onSnapshot((querySnapshot) => {
        const sprintBoardIds = [];
        const sprintBoardLists = querySnapshot.docs
          .map((doc) => {
            sprintBoardIds.push(doc.id);
            // array of lists in order of doc
            return doc.data();
          })
          .reduce((rest, list) => {
            return {
              ...rest,
              [list.id]: list, // sprint.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(sprintBoardLists);
        setListIds(sprintBoardIds);
        setLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggableId);
    // updateKanbanBoardItems(
    //   destination,
    //   source,
    //   sourceList,
    //   destinationList,
    //   draggableId,
    //   projectID
    // );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex" }}>
        {!loading &&
          listIds.map((listId, index) => {
            const list = lists[listId];
            return (
              <KanbanList
                key={list.id}
                list={list}
                lists={lists}
                listIds={listIds}
                tasks={tasks}
                members={members}
                scrum
                index={index}
              />
            );
          })}
      </div>
    </DragDropContext>
  );
}
