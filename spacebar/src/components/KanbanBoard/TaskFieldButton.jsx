import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import MemberAvatar from "../MemberAvatar";
import { updateTaskAssignee } from "../../FireStore";

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

export default function TaskFieldButton({ members, task }) {
  const classes = useStyles();
  const { projectID } = useParams();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const assignee = members[task.assignee];
  const displayName = assignee ? assignee.displayName : "Unassigned";
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
      >
        <MemberAvatar assignee={assignee} />
        &nbsp;
        {displayName}
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
                  {Object.keys(members).map((memberId, index) => {
                    if (memberId !== task.assignee) {
                      const member = members[memberId];
                      return (
                        <MenuItem
                          key={memberId}
                          onClick={(event) => {
                            updateTaskAssignee(task.id, memberId, projectID);
                            handleClose(event);
                          }}
                        >
                          <MemberAvatar assignee={member} />
                          &nbsp;
                          {member.displayName}
                        </MenuItem>
                      );
                    }
                  })}
                  {assignee && (
                    <MenuItem onClick={handleClose}>
                      <MemberAvatar assignee={undefined} />
                      &nbsp; Unassigned
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
