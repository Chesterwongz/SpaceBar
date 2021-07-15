import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { auth } from "../FireStore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appbar: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.primary.dark,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Appbar({ project }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} elevation={0}>
        <Toolbar variant="dense">
          <Typography className={classes.title} variant="h6">
            SPACEBAR
          </Typography>
          <Button color="inherit" href="/home">
            Your Projects
          </Button>
          <Button color="inherit" href="/account">
            Account
          </Button>
          {/* <Button color="inherit">Account</Button> */}
          <Button color="inherit" href="/" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
