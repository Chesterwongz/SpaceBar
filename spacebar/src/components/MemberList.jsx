import React, { useState, useEffect } from "react";
import { db } from "../FireStore";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";

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
  avatar: {
    width: 100,
    height: 100,
    fontSize: 60,
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
  const [members, setMembers] = useState([]);

  useEffect(() => {
    var unSubscribe = db
      .collection("users")
      .where("projectRef", "array-contains", projectID)
      .onSnapshot((querySnapshot) => {
        const members = [];
        querySnapshot.forEach((doc) => {
          members.push(doc.data());
        });
        setMembers(members);
      });

    return () => {
      unSubscribe();
    };
  }, [projectID]);

  return (
    <div>
      <h1>Members</h1>
      <div className={classes.members}>
        {members.map((member, index) => (
          <Card key={index} className={classes.card}>
            <CardContent className={classes.content}>
              <Avatar className={classes.avatar}>
                {getInitials(member.displayName)}
              </Avatar>
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
        ))}
      </div>
    </div>
  );
}
