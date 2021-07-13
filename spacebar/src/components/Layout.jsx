import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { SubjectOutlined } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router";
import { useParams } from "react-router-dom";
import Appbar from "./Appbar";

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
    paddingTop: 40,
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
  toolbar: theme.mixins.denseToolbar,
}));

export default function Layout({ children }) {
  const { projectID } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const menuItems = [
    {
      text: "Roadmap",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/roadmap`,
    },
    {
      text: "Hangout",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/hangout`,
    },
    {
      text: "Board",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/board`,
    },
    {
      text: "Team",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/team`,
    },
    {
      text: "Analytics",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/analytics`,
    },
  ];

  return (
    <div className={classes.root}>
      <Appbar />
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
