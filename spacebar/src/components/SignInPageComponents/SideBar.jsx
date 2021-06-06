import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Link as LinkScroll } from "react-scroll";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  SideBarContainer: {
    position: "fixed",
    top: (props) => (props.sideBarOpen ? "0" : "-100%"),
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.primary.dark,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    transition: "0.3s ease-in-out",
  },
  MenuContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  MenuLink: {
    fontSize: "2rem",
    marginBottom: "30px",
    cursor: "pointer",
    "&:hover": {
      transition: "0.2s ease-in-out",
      backgroundColor: theme.palette.primary.main,
      "border-radius": "50px",
      padding: "10px",
    },
  },
}));

const SideBar = ({ toggleSideBar, sideBarOpen }) => {
  const classes = useStyles({ sideBarOpen });
  return (
    <div className={classes.SideBarContainer} onClick={toggleSideBar}>
      <div className={classes.MenuContainer}>
        <div className={classes.MenuLink}>
          <LinkScroll
            to="main"
            smooth={true}
            duration={500}
            spy={true}
            exact="true"
            offset={-80}
            className={classes.Links}
            onClick={toggleSideBar}
          >
            About us
          </LinkScroll>
        </div>
        <div className={classes.MenuLink}>
          <LinkScroll
            to="features"
            smooth={true}
            duration={500}
            spy={true}
            exact="true"
            offset={-80}
            className={classes.Links}
            onClick={toggleSideBar}
          >
            Our features
          </LinkScroll>
        </div>
        <div className={classes.MenuLink}>
          <LinkScroll
            to="signIn"
            smooth={true}
            duration={500}
            spy={true}
            exact="true"
            offset={-80}
            className={classes.Links}
            onClick={toggleSideBar}
          >
            Sign in
          </LinkScroll>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
