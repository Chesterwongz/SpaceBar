import React, { useState, useEffect, useContext } from "react";
import Form from "../Form";
import { addComment, db } from "../../FireStore";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CurrentUserContext } from "../../utils/Context";
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

const Comments = ({ docID }) => {
  let { projectID } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(CurrentUserContext);
  const classes = useStyles();

  const handleSubmit = (value) => {
    addComment(projectID, docID, value, currentUser.displayName);
  };

  useEffect(() => {
    var unSubscribe = db
      .collection("Projects")
      .doc(projectID)
      .collection("drawingboard")
      .doc(docID)
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
          {comments.map((commentObj) => (
            <div className={classes.commentBox}>
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

export default Comments;