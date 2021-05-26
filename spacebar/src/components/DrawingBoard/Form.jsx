import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "70%", // 70% of card in drawing board
    },
  },
}));

export default function Form({ onSubmit }) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    if (value) {
      event.preventDefault();
      onSubmit(value);
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
