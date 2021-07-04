import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EpicWindow from "./EpicWindow";
import CreateEpicWindow from "./CreateEpicWindow";

const useStyles = makeStyles((theme) => ({
  epicList: {
    borderStyle: "solid",
    borderWidth: "1.5px",
    borderColor: "#999594",
    height: "800px",
  },
  epicObjOdd: {
    width: "200px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
    cursor: "pointer",
    backgroundColor: "#EBE6E5",
    "&:hover": {
      backgroundColor: "#C9C6C6",
    },
  },
  epicObjEven: {
    width: "200px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#C9C6C6",
    },
  },
  epicTitle: {
    width: "100%",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #999594",
  },
  epicButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50px",
    backgroundColor: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  icon: {
    marginLeft: "5px",
  },
}));
const EpicList = ({ epicData }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false); // for create epic window
  const [open2, setOpen2] = useState(false); // for epic window
  const [epicId, setEpicID] = useState();

  const handleOpenForCreateEpicWindow = () => {
    setOpen(true);
  };
  const handleOpenForEpicWindow = (epicID) => {
    setEpicID(epicID);
    setOpen2(true);
  };

  const handleCloseForCreateEpicWindow = () => {
    setOpen(false);
  };
  const handleCloseForEpicWindow = () => {
    setOpen2(false);
  };

  return (
    <div className={classes.epicList}>
      <div className={classes.epicTitle}>
        <h3>Epics</h3>
      </div>
      {epicData.map((epic, index) =>
        index % 2 ? (
          <div
            className={classes.epicObjEven}
            key={index}
            onClick={() => handleOpenForEpicWindow(epic.id)}
          >
            <p>{epic.title}</p>
          </div>
        ) : (
          <div
            className={classes.epicObjOdd}
            key={index}
            onClick={() => handleOpenForEpicWindow(epic.id)}
          >
            <p>{epic.title}</p>
          </div>
        )
      )}
      <div
        className={classes.epicButton}
        onClick={handleOpenForCreateEpicWindow}
      >
        <p>Add Epic</p>
        <AddIcon className={classes.icon} />
      </div>
      <CreateEpicWindow
        open={open}
        handleClose={handleCloseForCreateEpicWindow}
      />
      <EpicWindow
        open2={open2}
        handleCloseForEpicWindow={handleCloseForEpicWindow}
        epicId={epicId}
      />
    </div>
  );
};

export default EpicList;
