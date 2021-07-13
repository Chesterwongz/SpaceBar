import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "./ProgressBar";

const useStyles = makeStyles((theme) => ({
  progressContainer: {
    height: "760px",
    display: "flex",
  },
  currentDateLine: {
    height: "758px",
    width: "3px",
    backgroundColor: "#E3751E",
    position: "absolute",
  },
}));

const Progress = ({ epicData }) => {
  const classes = useStyles();

  const getStartingTimeStamp = (epicData) => {
    //get the javascript object for the first day of the first month on the board
    const month = epicData[0].startDate.toDate().getMonth();
    const year = epicData[0].startDate.toDate().getFullYear();
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    return startDate;
  };

  const getMarginLeft = () => {
    const start = getStartingTimeStamp(epicData);
    const now = Date.now();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const marginleft = 2400 * (diffDays / 365);
    return marginleft;
  };

  return (
    <div className={classes.progressContainer}>
      <div
        className={classes.currentDateLine}
        style={{ marginLeft: getMarginLeft() }}
      ></div>
      <div>
        {epicData.map((data, index) =>
          index % 2 ? (
            <ProgressBar
              data={data}
              key={index}
              odd={false}
              firstDate={getStartingTimeStamp(epicData)}
            />
          ) : (
            <ProgressBar
              data={data}
              key={index}
              odd={true}
              firstDate={getStartingTimeStamp(epicData)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Progress;
