import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import {
  db,
  updateKanbanBoardItems,
  updateCumulativeFlowDate,
} from "../FireStore";
const stringToColour = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (var i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}; // TODO: Move this somewhere else
export default function BoardPage() {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState({});
  const [listIds, setListIds] = useState([]);
  const [members, setMembers] = useState({});

  //Cache kanban board data for cumulative flow diagram
  useEffect(() => {
    updateCumulativeFlowDate(projectID);
  }, []);

  useEffect(() => {
    // Get tasks
    const projectRef = db.collection("Projects").doc(projectID);
    projectRef.collection("tasks").onSnapshot((querySnapshot) => {
      const boardTasks = querySnapshot.docs
        .map((doc) => {
          return doc.data();
        })
        .reduce((rest, task) => {
          return {
            ...rest,
            [task.id]: task,
          };
        }, {});
      setTasks(boardTasks);
    });
    // Get lists
    projectRef.collection("kanbanboard").onSnapshot((querySnapshot) => {
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
    // Get board members
    db.collection("users")
      .where("projectRef", "array-contains", projectID)
      .onSnapshot((querySnapshot) => {
        const boardMembers = querySnapshot.docs.reduce((rest, memberDoc) => {
          return {
            ...rest,
            [memberDoc.id]: {
              displayName: memberDoc.data().displayName,
              backgroundColor: stringToColour(memberDoc.id),
            },
          };
        }, {});
        setMembers(boardMembers);
      });
  }, [projectID]);

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
                return (
                  <KanbanBoard
                    key={list.id}
                    list={list}
                    lists={lists}
                    listIds={listIds}
                    tasks={tasks}
                    members={members}
                    index={index}
                  />
                );
              })}
          </div>
        </DragDropContext>
      )}
    </>
  );
}
