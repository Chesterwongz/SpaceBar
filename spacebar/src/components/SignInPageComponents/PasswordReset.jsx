import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { auth } from "../../FireStore";

const useStyles = makeStyles((theme) => ({
  passwordReset: {
    color: "#35baf6",
    cursor: "pointer",
  },
}));
const PasswordReset = ({ handleClickOpen, handleClose, open }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    auth.sendPasswordResetEmail(value).catch((error) => {
      alert(error.message);
      return;
    });
    handleClose();
    setValue("");
  };

  return (
    <div>
      <p className={classes.passwordReset} onClick={handleClickOpen}>
        Forgot your password?
      </p>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Reset your password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, enter your email address below and we will
            send you the link to reset your password
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={handleChange}
            value={value}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PasswordReset;
