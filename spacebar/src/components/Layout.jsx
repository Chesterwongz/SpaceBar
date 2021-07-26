import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import { SubjectOutlined, CalendarToday } from "@material-ui/icons";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import BarChartIcon from "@material-ui/icons/BarChart";
import ForumIcon from "@material-ui/icons/Forum";
import PeopleIcon from "@material-ui/icons/People";
import ArchiveIcon from "@material-ui/icons/Archive";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useParams } from "react-router-dom";
import Appbar from "./Appbar";

const openDrawerWidth = 240;
const closeDrawerWidth = 60;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  page: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  drawer: {
    width: openDrawerWidth,
  },
  drawerPaper: {
    width: openDrawerWidth,
    background: theme.palette.primary.light,
    paddingTop: 40,
  },
  closedDrawer: {
    width: closeDrawerWidth,
  },
  closedDrawerPaper: {
    width: closeDrawerWidth,
    background: theme.palette.primary.light,
    paddingTop: 40,
    overflow: "hidden",
  },
  active: {
    background: theme.palette.secondary.main,
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
      icon: <CalendarToday color="primary" />,
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
    {
      text: "Archive",
      icon: <ArchiveIcon color="primary" />,
      path: `/${projectID}/archive`,
    },
  ];

  return (
    <div className={classes.root}>
      <Appbar />
      <Drawer
        className={drawerOpen ? classes.drawer : classes.closedDrawer}
        variant="permanent"
        anchor="left"
        classes={{
          paper: drawerOpen ? classes.drawerPaper : classes.closedDrawerPaper,
        }}
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
              <Tooltip title={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
              </Tooltip>
              {drawerOpen && <ListItemText>{item.text}</ListItemText>}
            </ListItem>
          ))}
          <ListItem
            button
            key="close"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <ListItemIcon>
              {drawerOpen ? (
                <ArrowBackIosIcon color="primary" />
              ) : (
                <ArrowForwardIosIcon color="primary" />
              )}
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
      <div>
        <div className={classes.toolbar}></div>
        <div className={classes.page}>{children}</div>
      </div>
    </div>
  );
}
