import React, { useState } from "react";
import { auth, signInWithGoogle } from "../../FireStore";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  signIn: {
    backgroundColor: "white",
    width: "400px",
    height: "450px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "20px",
    margin: "30px",
  },
  button: {
    marginTop: "20px",
    minWidth: "165px",
    width: "auto",
    height: "50px",
    "letter-spacing": "0.5px",
    "line-height": "50px",
    padding: "0 35px 0 35px",
    "font-size": "15px",
    "background-color": "rgb(255, 255, 255)",
    color: "black",
    "font-weight": "bolder",
    border: "2px solid black",
    cursor: "pointer",
    display: "flex",
    "justify-content": "center",
    "&:hover": {
      "background-color": "black",
      color: "white",
      border: "1px solid black",
    },
  },
  googleButton: {
    marginTop: "20px",
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
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
  },
}));

const SigninComponent = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log(user.emailVerified);
        if (!user.emailVerified) {
          auth.signOut();
          alert("Verify your email before signing in");
        }
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };
  return (
    <div className={classes.signIn}>
      <h2>Sign in </h2>
      <span>Enter your email and password</span>
      <form onSubmit={handleSubmit}>
        <div>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item>
              <TextField
                id="input-with-icon-grid"
                label="Email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <LockIcon />
            </Grid>
            <Grid item>
              <TextField
                id="standard-password-input"
                type="password"
                label="Password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.buttonContainer}>
          <button
            className={classes.button}
            type="submit"
            onClick={handleSubmit}
          >
            Sign in
          </button>

          <button className={classes.googleButton} onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default SigninComponent;