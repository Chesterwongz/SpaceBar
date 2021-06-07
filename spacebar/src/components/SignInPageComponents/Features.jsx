import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "../../images/list.svg";
import Ideas from "../../images/ideas.svg";
import Metrics from "../../images/metrics.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: theme.palette.secondary.main,
    padding: "0 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media screen and (max-width: 768px)": {
      height: "1300px",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 24px",
  },
  header: {
    fontSize: "50px",
    textAlign: "center",
    marginBottom: "100px",
    "@media screen and (max-width: 768px)": {
      fontSize: "40px",
    },
    "@media screen and (max-width: 480px)": {
      fontSize: "32px",
    },
  },
  cards: {
    display: "flex",
    justifyContent: "space-between",
    "@media screen and (max-width: 768px)": {
      flexDirection: "column",
      marginBottom: "0px",
    },
  },
  card: {
    backgroundColor: "white",
    width: "300px",
    height: "300px",
    display: "flex",
    margin: "50px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    borderRadius: "20px",
    "box-shadow": "0 3px 5px rgba(0, 0, 0, 0, 2)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
      transition: "all 0.2s ease-in-out",
      cursor: "pointer",
    },
    "@media screen and (max-width: 768px)": {
      margin: "30px",
    },
  },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  cardDescription: {
    textAlign: "center",
    fontSize: "1rem",
  },
  image: {
    width: "130px",
    height: "130px",
  },
}));
const Features = () => {
  const classes = useStyles();
  return (
    <div className={classes.root} id="features">
      <div className={classes.content}>
        <h1 className={classes.header}>Our features</h1>
        <div className={classes.cards}>
          <div className={classes.card}>
            <img src={List} alt="list" className={classes.image} />
            <h2 className={classes.cardTitle}>Kanban Board</h2>
            <p className={classes.cardDescription}>
              Organize your tasks and track team progress with our kanban board
            </p>
          </div>
          <div className={classes.card}>
            <img src={Ideas} alt="ideas" className={classes.image} />
            <h2 className={classes.cardTitle}>Drawing Board</h2>
            <p className={classes.cardDescription}>
              Generate ideas here using Reddit style threads before adding them
              to the Kanban Board
            </p>
          </div>
          <div className={classes.card}>
            <img src={Metrics} alt="metrics" className={classes.image} />
            <h2 className={classes.cardTitle}>Data Analytics</h2>
            <p className={classes.cardDescription}>
              We compile useful metrics into charts and diagrams so that you can
              easily gain valuable insight on your projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
