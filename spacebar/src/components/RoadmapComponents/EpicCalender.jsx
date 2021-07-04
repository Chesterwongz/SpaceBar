import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Months from "./Months";
import Progress from "./Progress";

const useStyles = makeStyles((theme) => ({
  epicCalendar: {
    borderStyle: "solid",
    borderWidth: "1.5px",
    borderColor: "#999594",
    height: "800px",
  },
  EmptyDiv: {
    width: "300px",
    display: "flex",
    justifyContent: "center",
  },
}));
const EpicCalender = ({ epicData }) => {
  const classes = useStyles();
  return (
    <div className={classes.epicCalendar}>
      {epicData[0] ? (
        <div>
          <Months startDate={epicData[0].startDate.toDate()} />
          <Progress epicData={epicData} />
        </div>
      ) : (
        <div className={classes.EmptyDiv}>
          <h3>Create an Epic first</h3>
        </div>
      )}
    </div>
  );
};

export default EpicCalender;
