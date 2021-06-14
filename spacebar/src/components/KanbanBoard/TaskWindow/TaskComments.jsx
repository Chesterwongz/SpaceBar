import React, { useState, useEffect, useContext } from "react";
import Form from "../../Form";
import { addTaskComment, db } from "../../../FireStore";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CurrentUserContext } from "../../../utils/Context";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "30px",
  },
  commentBox: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    marginTop: "10px",
    alignItems: "center",
    borderRadius: "20px",
    wordBreak: "break-all",
  },
  comment: {
    fontSize: "1.5rem",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  author: {
    position: "absolute",
    right: 10,
    bottom: -10,
  },
}));

const TaskComments = ({ taskId }) => {
  let { projectID } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(CurrentUserContext);
  const classes = useStyles();

  const handleSubmit = (value) => {
    addTaskComment(projectID, taskId, value, currentUser.displayName);
  };

  useEffect(() => {
    var unSubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("tasks")
      .doc(taskId)
      .collection("comments")
      .orderBy("created", "desc")
      .onSnapshot((querySnapshot) => {
        var items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setComments(items);
        setLoading(false);
      });
    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Form placeHolder="Comment here" onSubmit={handleSubmit} />
      {loading === false ? (
        <div>
          {comments.map((commentObj, index) => (
            <div className={classes.commentBox} key={index}>
              <p className={classes.comment}>{commentObj.comment}</p>
              <p className={classes.author}>Posted by: {commentObj.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default TaskComments;
