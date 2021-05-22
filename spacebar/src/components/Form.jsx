import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import { db } from "../FireStore";
import { CurrentUserContext } from "../utils/Context";

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "70%", // 70% of card in drawing board
    },
  },
}));

export default function Form() {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const currentUser = useContext(CurrentUserContext);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    if (value) {
      event.preventDefault();
      db.collection("drawingboarditems").add({
        title: value,
        userID: currentUser.id,
      });
      setValue("");
    }
  };

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <div>
        <TextField
          id="standard-textarea"
          placeholder="Add item"
          multiline
          onChange={handleChange}
          value={value}
        />
        <IconButton aria-label="add" onClick={handleSubmit}>
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
      </div>
    </form>
  );
}
