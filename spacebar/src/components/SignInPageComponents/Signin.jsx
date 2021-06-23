import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Auth from "../../images/auth.svg";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig, signInWithGoogle } from "../../FireStore";
import SigninComponent from "./SigninComponent";
import SignupComponent from "./SignupComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "120vh",
    backgroundColor: theme.palette.primary.main,
    padding: "0 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "space-around",
    "@media screen and (max-width: 768px)": {
      flexDirection: "column",
      height: "170vh",
    },
  },
  imageContainer: {
    marginTop: "150px",
    display: "flex",
    justifyContent: "center",
    "@media screen and (max-width: 768px)": {
      display: "none",
    },
  },
  image: {
    height: "500px",
    width: "500px",
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
    maxWidth: "1500px",
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
  button: {
    marginTop: "30px",
    minWidth: "165px",
    width: "auto",
    height: "50px",
    backgroundColor: "#4285f4",
    color: "white",
    border: "none",
    letterSpacing: "0.5px",
    lineHeight: "50px",
    padding: "0 35px 0 35px",
    fontSize: "15px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#357ae8",
    },
  },
  forms: {
    display: "flex",
    alignItems: "center",
    "@media screen and (max-width: 768px)": {
      flexDirection: "column",
    },
  },
}));
const Signin = () => {
  const classes = useStyles();
  return (
    <div className={classes.root} id="signIn">
      <div className={classes.imageContainer}>
        <img src={Auth} alt="spaceship" className={classes.image} />
      </div>

      <div className={classes.content}>
        <h1 className={classes.header}>Sign in here</h1>
        <div className={classes.forms}>
          <SigninComponent />
          <SignupComponent />
        </div>
      </div>
    </div>
  );
};

export default Signin;
