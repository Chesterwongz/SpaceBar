import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import KanbanList from "./KanbanList.jsx";
import { updateKanbanBoardItems } from "../../FireStore";

export default function KanbanBoard({ tasks, lists, listIDs, members }) {
  const { projectID } = useParams();

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex" }}>
        {listIDs &&
          listIDs.map((listId, index) => {
            const list = lists[listId];
            return (
              <KanbanList
                key={list.id}
                list={list}
                lists={lists}
                listIDs={listIDs}
                tasks={tasks}
                members={members}
                index={index}
              />
            );
          })}
      </div>
    </DragDropContext>
  );
}
