import React, { useState, useEffect } from "react";
import { db } from "../FireStore";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import MemberAvatar from "./MemberAvatar";
const stringToColour = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (var i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};
const useStyles = makeStyles({
  card: {
    width: 200,
    height: 200,
    marginLeft: 40,
    display: "flex",
    justifyContent: "center",
  },
  members: {
    display: "flex",
  },
  content: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
  },
  typography: {
    width: 150,
    textAlign: "center",
  },
});

const getInitials = (displayName) => {
  const names = displayName.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export default function MemberList({ projectID }) {
  const classes = useStyles();
  const [members, setMembers] = useState({});

  useEffect(() => {
    let unsubscribe = db
      .collection("users")
      .where("projectRef", "array-contains", projectID)
      .onSnapshot((querySnapshot) => {
        const boardMembers = querySnapshot.docs.reduce((rest, memberDoc) => {
          return {
            ...rest,
            [memberDoc.id]: {
              displayName: memberDoc.data().displayName,
              backgroundColor: stringToColour(memberDoc.id),
            },
          };
        }, {});
        setMembers(boardMembers);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div>
      <h1>Members</h1>
      <div className={classes.members}>
        {Object.keys(members).map((memberId, index) => {
          const member = members[memberId];
          return (
            <Card key={index} className={classes.card}>
              <CardContent className={classes.content}>
                <MemberAvatar size="large" assignee={member} />
                <Typography
                  className={classes.typography}
                  variant="body2"
                  component="p"
                  noWrap
                >
                  {member.displayName}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
