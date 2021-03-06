import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditableTitle from "./EditableTitle";
import Comments from "./Comments";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: "auto",
    width: "60%",
  },
  delete: {
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#d9534f",
    marginTop: "5px",
    "&:hover": {
      backgroundColor: "#F08080",
    },
  },
}));

export default function CardWindow({ docID, onDelete, title }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    onDelete(docID);
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <EditableTitle title={title} docID={docID} type="post"/>
            <div className={classes.delete}>
              <Button
                variant="contained"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Item
              </Button>
            </div>
            <div>
              <Comments docID={docID} />
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
