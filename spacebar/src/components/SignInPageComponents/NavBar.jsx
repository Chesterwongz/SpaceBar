import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as LinkScroll } from "react-scroll";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  Nav: {
    backgroundColor: theme.palette.primary.dark,
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  NavContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1100px",
    width: "100%",
    height: "80px",
  },
  Logo: {
    textDecoration: "none",
    justifySelf: "flex-start",
    marginLeft: "24px",
    fontWeight: "bold",
    fontSize: "2rem",
    color: "black",
    cursor: "pointer",
  },
  NavMenu: {
    display: "flex",
    alignItems: "center",
    listStyle: "none",
    justifyContent: "center",
    "@media screen and (max-width: 768px)": {
      display: "none",
    },
  },
  Links: {
    color: "black",
    textDecoration: "none",
    padding: "0 1rem",
    cursor: "pointer",
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
  },
  LinkContainer: {
    height: "80px",
  },
  MobileIcon: {
    display: "none",
    "@media screen and (max-width: 768px)": {
      display: "block",
      position: "absolute",
      top: 0,
      right: 0,
      transform: "translate(-120%, 60%)",
      cursor: "pointer",
    },
  },
}));
const NavBar = ({ toggleSideBar }) => {
  const classes = useStyles();
  return (
    <div className={classes.Nav}>
      <div className={classes.NavContainer}>
        <div className={classes.MobileIcon} onClick={toggleSideBar}>
          <MenuIcon fontSize="large" />
        </div>
        <LinkScroll
          to="main"
          smooth={true}
          duration={500}
          spy={true}
          exact="true"
          offset={-80}
          className={classes.Logo}
        >
          SpaceBar
        </LinkScroll>
        <div className={classes.NavMenu}>
          <div className={classes.LinkContainer}>
            <LinkScroll
              to="features"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-80}
              className={classes.Links}
            >
              Our features
            </LinkScroll>
          </div>
          <div className={classes.LinkContainer}>
            <LinkScroll
              to="signIn"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-80}
              className={classes.Links}
            >
              Sign in
            </LinkScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
