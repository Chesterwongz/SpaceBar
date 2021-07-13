import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  progressBar: {
    width: "4800px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
    backgroundColor: (odd) => (odd ? "#EBE6E5" : "white"),
  },
  bar: {
    backgroundColor: theme.palette.primary.main,
    height: "25px",
    marginLeft: "0px",
    borderRadius: "5px",
  },
}));

const ProgressBar = ({ data, odd, firstDate }) => {
  const duration = (data.endDate - data.startDate) / (60 * 60 * 24); //duration of epic in days
  const lengthOfBar = 2400 * (duration / 365); //does not account for leap years
  const classes = useStyles(odd);
  const startDate = data.startDate.toDate(); //startdate as javascript date object
  const diffTime = Math.abs(startDate - firstDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); //number of days from the start of the first month on the board
  const marginleft = 2400 * (diffDays / 365);

  return (
    <div className={classes.progressBar}>
      <div
        className={classes.bar}
        style={{ width: lengthOfBar, marginLeft: marginleft }}
      ></div>
    </div>
  );
};

export default ProgressBar;
