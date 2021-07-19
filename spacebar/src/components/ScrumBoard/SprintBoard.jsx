import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import KanbanList from "../KanbanBoard/KanbanList.jsx";
import InputContainer from "../InputContainer/InputContainer.jsx";
import { db, dndList, dndSprintBoardItems } from "../../FireStore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));
export default function SprintBoard({ tasks, sprintID, members }) {
  const classes = useStyles();
  const { projectID } = useParams();
  const [lists, setLists] = useState({});
  const [listsLoading, setListsLoading] = useState(true);
  const [listIDs, setListIDs] = useState([]);
  const [listIDsLoading, setListIDsLoading] = useState(true);
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("scrum")
      .doc(sprintID)
      .collection("board")
      .onSnapshot((querySnapshot) => {
        const sprintBoardLists = querySnapshot.docs
          .map((doc) => {
            return doc.data();
          })
          .reduce((rest, list) => {
            return {
              ...rest,
              [list.id]: list, // sprint.id needs to be equal to doc.id!!!
            };
          }, {});
        setLists(sprintBoardLists);
        setListsLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // Get kanbanboard list order
  useEffect(() => {
    let unsubscribe = db
      .collection("Projects")
      .doc(projectID)
      .onSnapshot((doc) => {
        setListIDs(doc.data().listIDs);
        setListIDsLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (type === "list") {
      const newListIDs = listIDs;
      newListIDs.splice(source.index, 1);
      newListIDs.splice(destination.index, 0, draggableId);
      dndList(newListIDs, projectID);
      return;
    }
    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggableId);
    dndSprintBoardItems(
      destination,
      source,
      sourceList,
      destinationList,
      draggableId,
      sprintID,
      projectID
    );
  };

  return (
    !listsLoading &&
    !listIDsLoading && (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="app" type="list" direction="horizontal">
          {(provided) => (
            <div
              className={classes.root}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {listIDs.map((listID, index) => {
                const list = lists[listID];
                return (
                  list && (
                    <KanbanList
                      key={list.id}
                      list={list}
                      lists={lists}
                      listIDs={listIDs}
                      tasks={tasks}
                      members={members}
                      sprintID={sprintID}
                      index={index}
                    />
                  )
                );
              })}
              {provided.placeholder}
              <InputContainer type="list" sprint />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  );
}
