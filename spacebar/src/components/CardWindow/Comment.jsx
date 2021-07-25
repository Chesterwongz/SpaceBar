import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { db } from "../../FireStore";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
  button: {
    position: "absolute",
    right: 10,
    top: 10,
  },
}));

const Comment = ({
  comment,
  author,
  authorID,
  currentUserID,
  commentID,
  docID,
  task,
  taskID,
}) => {
  const classes = useStyles();
  let { projectID } = useParams();

  const deleteComment = () => {
    if (task) {
      db.collection("Projects")
        .doc(projectID)
        .collection("tasks")
        .doc(taskID)
        .collection("comments")
        .doc(commentID)
        .delete()
        .catch((error) => {
          console.log(error + "Error deleting comment");
        });
    } else {
      //drawing board comment
      db.collection("Projects")
        .doc(projectID)
        .collection("drawingboard")
        .doc(docID)
        .collection("comments")
        .doc(commentID)
        .delete()
        .catch((error) => {
          console.log(error + "Error deleting comment");
        });
    }
  };
  return (
    <div className={classes.commentBox}>
      <p className={classes.comment}>{comment}</p>
      <p className={classes.author}>Posted by: {author}</p>
      {authorID === currentUserID ? (
        <IconButton
          aria-label="delete"
          className={classes.button}
          onClick={deleteComment}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Comment;
