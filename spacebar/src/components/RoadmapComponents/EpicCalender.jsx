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
}));
const EpicCalender = ({ epicData }) => {
  const classes = useStyles();
  return (
    <div className={classes.epicCalendar}>
      <Months startDate={epicData[0].startDate.toDate()} />
      <Progress epicData={epicData} />
    </div>
  );
};

export default EpicCalender;
