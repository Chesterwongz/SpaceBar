import React, { useState, useEffect, useContext } from "react";
import { db } from "../FireStore";
import { useParams } from "react-router-dom";
import firebase from "../FireStore";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PeopleIcon from "@material-ui/icons/People";
import { CurrentUserContext } from "../utils/Context";
import Alert from "@material-ui/lab/Alert";
import MemberList from "../components/MemberList"; 

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "50ch",
    },
    marginTop: 30
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function TeamPage() {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);
  const projectID = useParams().projectID;
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (currentUser) {
      setCurrentUserEmail(currentUser.email);
    }
  }, [currentUser]);

  const checkEmailInDatabase = (email) => {
    return db
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        const size = querySnapshot.size;
        if (size == 0) {
          // email does not exist
          return false;
        } else {
          return true;
        }
      });
  };

  const checkFormError = () => {
    //check if the value is not your own email. and value is in database
    if (value == "") {
      setErrorMessage("Please enter a value");
    } else if (value == currentUserEmail) {
      setErrorMessage("You cannot add yourself");
    } else {
      checkEmailInDatabase(value).then((emailExists) => {
        if (!emailExists) {
          setErrorMessage(value + " is not a valid user");
        } else {
          //Success
          setErrorMessage("");
          db.collection("users")
            .where("email", "==", value)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                /**Update projectRef array in firebase. 
                    Firebase handles duplicate values so even if a user clicks on the button twice it will 
                    only update once. When creating users, there is also no need to create the projectRef field
                    as even if field doed not exist it will automatically create **/
                db.collection("users")
                  .doc(doc.id)
                  .update({
                    projectRef:
                      firebase.firestore.FieldValue.arrayUnion(projectID),
                  });
              });
            });
        }
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkFormError();
    setValue("");
  };

  return (
    <div>
    <MemberList projectID={projectID}/>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="outlined-basic"
          label="Enter email"
          variant="outlined"
          onChange={handleChange}
          value={value}
        />
      </form>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        endIcon={<PeopleIcon />}
        onClick={handleSubmit}
      >
        Add member
      </Button>
      {errorMessage != "" ? (
        <Alert
          severity="error"
          onClose={() => {
            setErrorMessage("");
          }}
        >
          {errorMessage}
        </Alert>
      ) : null}
    </div>
  );
}
