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
    color: red[500],
  },
  high: {
    color: orange[500],
  },
  medium: {
    color: amber[500],
  },
  low: {
    color: lightGreen[500],
  },
  lowest: {
    color: green[500],
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
