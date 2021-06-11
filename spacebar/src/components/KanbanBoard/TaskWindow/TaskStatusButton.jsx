import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { updateTaskField } from "../../../FireStore";

const useStyles = makeStyles((theme) => ({
  button: {
    display: "flex",
    justifyContent: "flex-start",
    width: 200,
  },
  popout: {
    width: 200,
    zIndex: theme.zIndex.modal + 1,
  },
}));

export default function TaskStatusButton({ task }) {
  const classes = useStyles();
  const { projectID } = useParams();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const statusList = ["Todo", "Doing", "Done"]; // TODO: Shouldnt be hardcoded

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button
        className={classes.button}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        disabled
      >
        <Typography variant="button" noWrap>
          &nbsp;
          {task.status}
        </Typography>
      </Button>
      <Popper
        className={classes.popout}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {statusList.map((status, index) => {
                    if (status !== task.status) {
                      return (
                        <MenuItem
                          key={index}
                          onClick={(event) => {
                            // TODO: moveTask();
                            handleClose(event);
                          }}
                        >
                          {status}
                        </MenuItem>
                      );
                    }
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
