import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import { db } from "../../FireStore";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
  form: {
    display: "flex",
    flexDirection: "column",
  },
}));
const EpicList = ({ epicData }) => {
  const classes = useStyles();
  const { projectID } = useParams();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(Date.now());
  const [endDate, setEndDate] = useState(Date.now());

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleSubmit = () => {
    setOpen(false);
    setTitle("");
    db.collection("Projects").doc(projectID).collection("epics").add({
      title: title,
      startDate: startDate,
      endDate: endDate,
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setTitle(value);
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
            onClick={handleOpen2}
          >
            <p>{epic.title}</p>
          </div>
        ) : (
          <div className={classes.epicObjOdd} key={index} onClick={handleOpen2}>
            <p>{epic.title}</p>
          </div>
        )
      )}
      <div className={classes.epicButton} onClick={handleOpen}>
        <p>Add Epic</p>
        <AddIcon className={classes.icon} />
      </div>
      {/* Modal for Add Epic button  */}
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
            <form className={classes.form}>
              <TextField
                id="input-with-icon-grid"
                label="Title"
                onChange={handleChange}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Start Date"
                  format="MM/dd/yyyy"
                  value={startDate}
                  onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="End Date"
                  format="MM/dd/yyyy"
                  value={endDate}
                  onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<AddIcon />}
                onClick={handleSubmit}
              >
                Add Epic
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
      {/* Modal for window */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open2}
        onClose={handleClose2}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open2}>
          <div className={classes.paper}>
            <h1>hi</h1>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default EpicList;
