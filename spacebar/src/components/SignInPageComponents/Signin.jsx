import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Auth from "../../images/auth.svg";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig, signInWithGoogle } from "../../FireStore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "120vh",
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
    flexDirection: "column",
    alignItems: "center",
  },
}));
const Signin = () => {
  const classes = useStyles();
  return (
    <div className={classes.root} id="signIn">
      <img src={Auth} alt="spaceship" className={classes.image} />
      <div className={classes.content}>
        <h1 className={classes.header}>Sign in here</h1>
        <div className={classes.forms}>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
          <button className={classes.button} onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
