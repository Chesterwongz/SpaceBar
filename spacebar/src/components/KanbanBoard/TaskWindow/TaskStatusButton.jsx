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
import { db, moveTask, moveScrumTask } from "../../../FireStore";

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
  menuItem: {
    textTransform: "uppercase",
  },
}));

export default function TaskStatusButton({ task, sprintID }) {
  const { projectID } = useParams();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState({});
  const [listIDs, setListIDs] = useState([]);
  const anchorRef = useRef(null);
  // const currentStatus = lists[task.status].title;

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

  useEffect(() => {
    const projectRef = db.collection("Projects").doc(projectID);
    projectRef.get().then((doc) => {
      setListIDs(doc.data().listIDs);
    });
    if (sprintID) {
      projectRef
        .collection("scrum")
        .doc("backlog")
        .collection("board")
        .get()
        .then((querySnapshot) => {
          const statusLists = querySnapshot.docs
            .map((doc) => {
              return doc.data();
            })
            .reduce((rest, list) => {
              return {
                ...rest,
                [list.id]: list.title, // list.id needs to be equal to doc.id!!!
              };
            }, {});
          setLists(statusLists);
        });
    } else {
      projectRef
        .collection("kanbanboard")
        .get()
        .then((querySnapshot) => {
          const boardLists = querySnapshot.docs
            .map((doc) => {
              return doc.data();
            })
            .reduce((rest, list) => {
              return {
                ...rest,
                [list.id]: list.title, // sprint.id needs to be equal to doc.id!!!
              };
            }, {});
          setLists(boardLists);
        });
    }
  }, []);

  return (
    <div>
      <Button
        className={classes.button}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Typography variant="button" noWrap>
          &nbsp;
          {/* {console.log(lists)} */}
          {lists[task.status]}
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
                  {listIDs.map((listID, index) => {
                    if (listID !== task.status) {
                      const status = lists[listID];
                      return (
                        <MenuItem
                          key={index}
                          className={classes.menuItem}
                          onClick={(event) => {
                            const from = task.status;
                            const to = listID;
                            if (sprintID) {
                              moveScrumTask(
                                task.id,
                                from,
                                to,
                                sprintID,
                                projectID
                              );
                            } else {
                              moveTask(task.id, from, to, projectID);
                            }
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
