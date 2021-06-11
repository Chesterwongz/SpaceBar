import { makeStyles, Tooltip } from "@material-ui/core";
import {
  amber,
  green,
  lightGreen,
  orange,
  red,
} from "@material-ui/core/colors";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import React from "react";

const useStyles = makeStyles({
  highest: {
    color: red["A700"],
  },
  high: {
    color: orange["A700"],
  },
  medium: {
    color: amber["A700"],
  },
  low: {
    color: lightGreen["A700"],
  },
  lowest: {
    color: green["A700"],
  },
});
export default function PriorityIcon({ variant }) {
  const classes = useStyles();
  return (
    <Tooltip title={variant}>
      <PriorityHighIcon
        className={
          variant === "Highest"
            ? classes.highest
            : variant === "High"
            ? classes.high
            : variant === "Medium"
            ? classes.medium
            : variant === "Low"
            ? classes.low
            : variant === "Lowest"
            ? classes.lowest
            : null
        }
      />
    </Tooltip>
  );
}
