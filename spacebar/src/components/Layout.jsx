import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { SubjectOutlined } from "@material-ui/icons";
import BarChartIcon from "@material-ui/icons/BarChart";
import ForumIcon from "@material-ui/icons/Forum";
import PeopleIcon from "@material-ui/icons/People";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useParams } from "react-router-dom";
import Appbar from "./Appbar";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  page: {
    flexGrow: 1,
    padding: theme.spacing(2),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  pageShift: {
    padding: theme.spacing(2),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const menuItems = [
    {
      text: "Roadmap",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/roadmap`,
    },
    {
      text: "Hangout",
      icon: <ForumIcon color="primary" />,
      path: `/${projectID}/hangout`,
    },
    {
      text: "Board",
      icon: <SubjectOutlined color="primary" />,
      path: `/${projectID}/board`,
    },
    {
      text: "Team",
      icon: <PeopleIcon color="primary" />,
      path: `/${projectID}/team`,
    },
    {
      text: "Analytics",
      icon: <BarChartIcon color="primary" />,
      path: `/${projectID}/analytics`,
    },
  ];

  return (
    <div className={classes.root}>
      <Appbar />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
        open={drawerOpen}
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
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div>
        <div className={classes.toolbar}></div>
        <div className={drawerOpen ? classes.pageShift : classes.page}>
          {children}
        </div>
      </div>
    </div>
  );
}
