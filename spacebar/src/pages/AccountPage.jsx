import React, { useState, useEffect, useContext } from "react";
import Appbar from "../components/Appbar";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { CurrentUserContext } from "../utils/Context";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Typography } from "@material-ui/core";
import Astronaut from "../images/amongUs.png";
import Button from "@material-ui/core/Button";
import green from "@material-ui/core/colors/green";
import EditIcon from "@material-ui/icons/Edit";
import { auth, db } from "../FireStore";

const useStyles = makeStyles((theme) => ({
  profileContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  profileCard: {
    width: "400px",
    height: "500px",
    backgroundColor: theme.palette.primary.light,
    borderRadius: "10px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      boxShadow:
        "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    },
  },
  profilePic: {
    backgroundColor: "white",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginBottom: "40px",
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "40%",
  },
  button: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: "auto",
    width: "300px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    marginTop: "40px",
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  displayName: {
    width: "300px",
  },
}));
const AccountPage = () => {
  const currentUser = useContext(CurrentUserContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName);
    }
  }, [currentUser]);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    handleOpen();
  };

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
  };

  const saveChanges = () => {
    //update firebase auth data
    const user = auth.currentUser;
    user.updateProfile({
      displayName: name,
    });
    //update firestore
    db.collection("users").doc(currentUser.id).update({
      displayName: name,
    });
    setName(currentUser.displayName);
    setOpen(false);
  };

  return (
    <div>
      <Appbar />
      {currentUser && currentUser.displayName ? (
        <div className={classes.profileContainer}>
          <div className={classes.profileCard}>
            <div>
              <img className={classes.profilePic} src={Astronaut} />
            </div>
            <div className={classes.profileDetails}>
              <Typography className={classes.displayName} noWrap>
                <h1>{currentUser.displayName}</h1>
              </Typography>
              <div className={classes.email}>
                <h4>Email: {currentUser.email}</h4>
              </div>
              <div>
                <Button
                  variant="contained"
                  className={classes.button}
                  startIcon={<EditIcon />}
                  onClick={handleClick}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <TextField
                  id="input-with-icon-grid"
                  label="Name"
                  value={name}
                  name="name"
                  onChange={handleChange}
                />

                <Button
                  variant="contained"
                  className={classes.saveButton}
                  startIcon={<EditIcon />}
                  onClick={saveChanges}
                >
                  Save Changes
                </Button>
              </div>
            </Fade>
          </Modal>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default AccountPage;
