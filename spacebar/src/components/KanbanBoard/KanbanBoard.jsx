import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import KanbanList from "./KanbanList.jsx";
import { dndKanbanList, updateKanbanBoardItems } from "../../FireStore";
import { makeStyles } from "@material-ui/styles";
import InputContainer from "../InputContainer/InputContainer.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

export default function KanbanBoard({ tasks, lists, listIDs, members }) {
  const { projectID } = useParams();
  const classes = useStyles();

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (type === "list") {
      const newListIDs = listIDs;
      newListIDs.splice(source.index, 1);
      newListIDs.splice(destination.index, 0, draggableId);
      dndKanbanList(newListIDs, projectID);
      return;
    }
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
      <Droppable droppableId="app" type="list" direction="horizontal">
        {(provided) => (
          <div
            className={classes.root}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {listIDs &&
              listIDs.map((listId, index) => {
                const list = lists[listId];
                return (
                  list && (
                    <KanbanList
                      key={list.id}
                      list={list}
                      lists={lists}
                      listIDs={listIDs}
                      tasks={tasks}
                      members={members}
                      index={index}
                    />
                  )
                );
              })}
            {provided.placeholder}
            <InputContainer type="list" />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
