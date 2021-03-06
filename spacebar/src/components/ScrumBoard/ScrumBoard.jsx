import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { addSprint, dndScrumBoardTasks } from "../../FireStore";
import Backlog from "./Backlog";
import Sprint from "./Sprint";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "77vw",
  },
  backlog: {
    flex: "0 0 50%",
  },
  sprints: {
    flex: "0 0 50%",
    display: "flex",
    flexDirection: "column",
  },
  btn: {
    marginTop: theme.spacing(1),
  },
}));

export default function ScrumBoard({
  tasks,
  sprintIDs,
  lists,
  members,
  currentSprint,
}) {
  let count = 1;
  const classes = useStyles();
  const { projectID } = useParams();

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const sourceList = lists[source.droppableId];
    const destinationList = lists[destination.droppableId];
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggableId);
    const draggingCard = tasks[draggableId];
    dndScrumBoardTasks(
      destination,
      source,
      sourceList,
      destinationList,
      draggingCard,
      projectID
    );
  };
  const handleClick = () => {
    addSprint(projectID, count);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.root}>
        <div className={classes.backlog}>
          <Backlog
            key="backlog"
            list={lists.backlog}
            tasks={tasks}
            members={members}
          />
        </div>
        <div className={classes.sprints}>
          {sprintIDs.map((sprintId, index) => {
            const sprint = lists[sprintId];
            count++;
            return (
              sprint && (
                <Sprint
                  key={sprint.id}
                  list={sprint}
                  tasks={tasks}
                  members={members}
                  currentSprint={currentSprint}
                  index={index}
                />
              )
            );
          })}
          <Button className={classes.btn} fullWidth onClick={handleClick}>
            <Typography>+ Add Sprint</Typography>
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
}
