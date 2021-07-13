import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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
const useStyles = makeStyles((theme) => ({
  monthContainer: {
    display: "flex",
  },
  monthHeader: {
    width: "200px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #999594",
    borderRight: "1px solid #999594",
  },
}));
const Months = ({ startDate }) => {
  const classes = useStyles();
  var monthIndex = startDate.getMonth();
  var year = startDate.getFullYear();
  const displayedMonths = [];
  while (displayedMonths.length < 24) {
    //assumption that project won't take longer than 2 years
    displayedMonths.push(months[monthIndex] + " " + year.toString());
    if (monthIndex < 11) {
      monthIndex++;
    } else {
      monthIndex = 0;
      year++;
    }
  }
  return (
    <div className={classes.monthContainer}>
      {displayedMonths.map((month, index) => (
        <div key={index} className={classes.monthHeader}>
          {month}
        </div>
      ))}
    </div>
  );
};

export default Months;
