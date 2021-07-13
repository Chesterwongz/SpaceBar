import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import green from "@material-ui/core/colors/green";
import { db } from "../../FireStore";
import firebase from "firebase";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const useStyles = makeStyles((theme) => ({
  dateBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: green[500],
  },
}));

const DateDescriptionBox = ({
  projectID,
  epicId,
  startDate,
  endDate,
  handleCloseForEpicWindow,
}) => {
  const classes = useStyles();
  const [editDate, setEditDate] = useState(Date.now());
  const [edit, setEdit] = useState(false);
  const [isEditingStartDate, setIsEditingStartDate] = useState();
  const formatDate = (googledate) => {
    const year = googledate.toDate().getFullYear();
    const month = months[googledate.toDate().getMonth()];
    const date = googledate.toDate().getDate();
    const day = days[googledate.toDate().getDay()];
    return day + " " + date + " " + month + " " + year;
  };
  const handleStartEdit = () => {
    setEditDate(startDate.toDate());
    setIsEditingStartDate(true);
    setEdit(!edit);
  };
  const handleEndEdit = () => {
    setEditDate(endDate.toDate());
    setIsEditingStartDate(false);
    setEdit(!edit);
  };
  const handleDateChange = (date) => {
    setEditDate(date);
  };
  const changeStartingDate = () => {
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .doc(epicId)
      .update({
        startDate: firebase.firestore.Timestamp.fromDate(editDate),
      });
    handleCloseForEpicWindow();
  };
  const changeEndDate = () => {
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .doc(epicId)
      .update({
        endDate: firebase.firestore.Timestamp.fromDate(editDate),
      });
    handleCloseForEpicWindow();
  };
  return (
    <div>
      <div className={classes.dateBox}>
        <p>Start Date: {formatDate(startDate)}</p>
        <IconButton onClick={handleStartEdit} style={{ color: green[500] }}>
          <EditIcon />
        </IconButton>
      </div>
      <div className={classes.dateBox}>
        <p>End Date: {formatDate(endDate)}</p>
        <IconButton onClick={handleEndEdit} style={{ color: green[500] }}>
          <EditIcon />
        </IconButton>
      </div>
      {edit ? (
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Edit Date"
              format="MM/dd/yyyy"
              onChange={handleDateChange}
              value={editDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          {isEditingStartDate ? (
            <div>
              {" "}
              <Button
                className={classes.button}
                variant="contained"
                startIcon={<EditIcon />}
                onClick={changeStartingDate}
              >
                Edit Starting Date
              </Button>
            </div>
          ) : (
            <div>
              {" "}
              <Button
                className={classes.button}
                variant="contained"
                startIcon={<EditIcon />}
                onClick={changeEndDate}
              >
                Edit Ending Date
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DateDescriptionBox;
