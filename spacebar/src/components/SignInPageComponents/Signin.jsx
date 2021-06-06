import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Auth from "../../images/auth.svg";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig } from "../../FireStore";

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
    transform: "translate(0, -50%)",
    "@media screen and (max-width: 768px)": {
      height: "300",
      width: "300px",
      transform: "translate(0, 0)",
    },
    "@media screen and (max-width: 480px)": {
      height: "200px",
      width: "200px",
      transform: "translate(0, 0)",
    },
  },
  content: {
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 24px",
    transform: "translate(0, -60%)",
    "@media screen and (max-width: 768px)": {
      transform: "translate(0, 0)",
    },
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
}));
const Signin = () => {
  const classes = useStyles();
  return (
    <div className={classes.root} id="signIn">
      <img src={Auth} alt="spaceship" className={classes.image} />
      <div className={classes.content}>
        <h1 className={classes.header}>Sign in here</h1>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    </div>
  );
};

export default Signin;
