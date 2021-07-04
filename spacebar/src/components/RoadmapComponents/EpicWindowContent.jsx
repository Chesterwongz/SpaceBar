import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../FireStore";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import EditableTitle from "../CardWindow/EditableTitle";
import { CircularProgress } from "@material-ui/core";
import DescriptionBox from "./DescriptionBox";
import DeleteIcon from "@material-ui/icons/Delete";
import DateDescriptionBox from "./DateDescriptionBox";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#d9534f",
    marginTop: "5px",
    "&:hover": {
      backgroundColor: "#F08080",
    },
  },
}));

const EpicWindowContent = ({ epicId, handleCloseForEpicWindow }) => {
  const classes = useStyles();
  const [epicWindowData, setEpicWindowData] = useState();
  let { projectID } = useParams();
  useEffect(() => {
    //query
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .doc(epicId)
      .get()
      .then((query) => {
        setEpicWindowData(query.data());
      });
  }, [projectID, epicId]);

  const handleDelete = () => {
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .doc(epicId)
      .delete()
      .catch((error) => console.log("Error deleting epic", error));
    handleCloseForEpicWindow();
  };
  return (
    <div>
      {epicWindowData ? (
        <div>
          <EditableTitle
            title={epicWindowData.title}
            type="epic"
            epicId={epicId}
          />
          <DescriptionBox
            projectID={projectID}
            epicId={epicId}
            desc={epicWindowData.description}
          />
          <Button
            className={classes.button}
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete Epic
          </Button>
          <DateDescriptionBox
            projectID={projectID}
            epicId={epicId}
            startDate={epicWindowData.startDate}
            endDate={epicWindowData.endDate}
            handleCloseForEpicWindow={handleCloseForEpicWindow}
          />
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default EpicWindowContent;
