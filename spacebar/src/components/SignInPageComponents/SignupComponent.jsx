import React, { useState } from "react";
import { auth } from "../../FireStore";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  signUp: {
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
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
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
}));
const SignupComponent = () => {
  const classes = useStyles();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          userCredential.user.sendEmailVerification();
          alert("An email verification code has been sent to your account");
        })
        .then(() => {
          const user = auth.currentUser;
          user
            .updateProfile({
              displayName: displayName,
            })
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        })
        .then(() => {
          auth.signOut();
        })
        .then(() => {
          setDisplayName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          var errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "displayName") {
      setDisplayName(value);
    }
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div className={classes.signUp}>
      <h2 className="title">I don't have an account</h2>
      <span className="span">Sign Up with your email and password</span>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div>
          <TextField
            id="input-with-icon-grid"
            label="Name"
            name="displayName"
            value={displayName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <TextField
            id="input-with-icon-grid"
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <TextField
            id="standard-password-input"
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <TextField
            id="standard-password-input"
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.buttonContainer}>
          <button
            className={classes.button}
            type="submit"
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupComponent;
