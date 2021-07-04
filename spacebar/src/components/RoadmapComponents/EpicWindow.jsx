import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import EpicWindowContent from "./EpicWindowContent";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const EpicWindow = ({ open2, handleCloseForEpicWindow, epicId }) => {
  const classes = useStyles();
  let { projectID } = useParams();
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open2}
        onClose={handleCloseForEpicWindow}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open2}>
          <div className={classes.paper}>
            <EpicWindowContent
              epicId={epicId}
              handleCloseForEpicWindow={handleCloseForEpicWindow}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default EpicWindow;
