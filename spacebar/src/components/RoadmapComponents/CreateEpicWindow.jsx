import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../FireStore";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
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
  form: {
    display: "flex",
    flexDirection: "column",
  },
}));

const CreateEpicWindow = ({ handleClose, open }) => {
  const { projectID } = useParams();
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleSubmit = () => {
    handleClose();
    setTitle("");
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .add({
        title: title,
        startDate: firebase.firestore.Timestamp.fromDate(startDate),
        endDate: firebase.firestore.Timestamp.fromDate(endDate),
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setTitle(value);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  return (
    <div>
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
    </div>
  );
};

export default CreateEpicWindow;
