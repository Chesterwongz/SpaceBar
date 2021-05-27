import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { SubjectOutlined } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router";
import { auth } from "../FireStore";
import { useParams } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  page: {
    padding: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.primary.light,
    paddingTop: 64,
  },
  active: {
    background: theme.palette.primary.main,
  },
  appbar: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.primary.dark,
  },
  title: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
}));

export default function Layout({ children }) {
  const { projectID } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const menuItems = [
    {
      text: "DrawingBoard",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/drawingboard`,
    },
    {
      text: "Board",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/board`,
    },
  ];

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} elevation={0}>
        <Toolbar variant="regular">
          <Typography className={classes.title} variant="h6">
            SPACEBAR
          </Typography>
          <Button color="inherit">Team</Button>
          <Button color="inherit">Account</Button>
          <Button color="inherit" href="/" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => history.push(item.path)}
              className={
                location.pathname === item.path ? classes.active : null
              }
            >
              <ListItemText>{item.text}</ListItemText>
              <ListItemIcon>{item.icon}</ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div>
        <div className={classes.toolbar}></div>
        <div className={classes.page}>{children}</div>
      </div>
    </div>
  );
}
