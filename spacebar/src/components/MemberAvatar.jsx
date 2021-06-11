import { Avatar, makeStyles, Typography, Tooltip } from "@material-ui/core";
import React from "react";

const BRIGHTNESS_THRESHOLD = 164;
const getContrastYIQ = (hexcolor) => {
  if (!hexcolor) return;
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const perceivedBrightness = (r * 299 + g * 587 + b * 114) / 1000;
  return perceivedBrightness >= BRIGHTNESS_THRESHOLD ? "black" : "white";
};
const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: (props) => props.backgroundColor,
  },
  avatarName: {
    fontSize: "0.7rem",
    fontWeight: theme.typography.fontWeightMedium,
    color: (props) => getContrastYIQ(props.backgroundColor),
  },
}));

export default function MemberAvatar({ assignee }) {
  const isAssigned = (assignee) => {
    return assignee && assignee.displayName;
  };
  const getInitials = (user) => {
    if (!isAssigned(user)) return;
    const names = user.displayName.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const classes = useStyles(assignee || { backgroundColor: "" });
  const assigneeInitials = getInitials(assignee);

  return (
    <div>
      <Tooltip
        title={isAssigned(assignee) ? assignee.displayName : "Unassigned"}
      >
        <Avatar className={classes.avatar} src="/linktouserprofilepic">
          {isAssigned(assignee) && (
            <Typography className={classes.avatarName}>
              {assigneeInitials}
            </Typography>
          )}
        </Avatar>
      </Tooltip>
    </div>
  );
}
