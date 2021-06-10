import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ScrumBoard from "../../images/scrumboard.svg";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { Link as LinkScroll } from "react-scroll";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: theme.palette.primary.main,
    padding: "0 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media screen and (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  image: {
    height: "400px",
    width: "400px",
    "@media screen and (max-width: 768px)": {
      height: "300",
      width: "300px",
    },
    "@media screen and (max-width: 480px)": {
      height: "200px",
      width: "200px",
    },
  },
  content: {
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 24px",
  },
  header: {
    fontSize: "50px",
    textAlign: "center",
    "@media screen and (max-width: 768px)": {
      fontSize: "40px",
    },
    "@media screen and (max-width: 480px)": {
      fontSize: "32px",
    },
  },
  description: {
    fontSize: "24px",
    textAlign: "center",
    marginTop: "24px",
    "@media screen and (max-width: 768px)": {
      fontSize: "24px",
    },
    "@media screen and (max-width: 480px)": {
      fontSize: "18px",
    },
  },
  linkScroll: {
    width: "150px",
    height: "50px",
    backgroundColor: theme.palette.secondary.main,
    transition: "0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "30px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
      transform: "scale(1.1)",
      transition: "0.2s ease-in-out",
    },
  },
}));
const Main = () => {
  const classes = useStyles();
  return (
    <div className={classes.root} id="main">
      <div className={classes.content}>
        <h1 className={classes.header}>TESTING now </h1>
        <p className={classes.description}>
          SpaceBar is a project management site aimed at improving productivity
          and organizing tasks for users
        </p>
        <LinkScroll
          to="signIn"
          smooth={true}
          duration={500}
          spy={true}
          exact="true"
          offset={-80}
          className={classes.linkScroll}
        >
          <p>Get Started</p>
          <DoubleArrowIcon />
        </LinkScroll>
      </div>
      <img src={ScrumBoard} alt="spaceship" className={classes.image} />
    </div>
  );
};

export default Main;
