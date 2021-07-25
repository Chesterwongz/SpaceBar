import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addComment, db } from "../../FireStore";
import { CurrentUserContext } from "../../utils/Context";
import Form from "../Form";
import Comment from "./Comment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "30px",
  },
}));

const Comments = ({ docID }) => {
  let { projectID } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(CurrentUserContext);
  const classes = useStyles();

  const handleSubmit = (value) => {
    addComment(
      projectID,
      docID,
      value,
      currentUser.displayName,
      currentUser.id
    );
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
  }, [docID, projectID]);

  return (
    <div className={classes.root}>
      <Form placeHolder="Comment here" onSubmit={handleSubmit} />
      {loading === false ? (
        <div>
          {comments.map((commentObj, index) => (
            <Comment
              key={index}
              comment={commentObj.comment}
              author={commentObj.author}
              authorID={commentObj.authorID}
              currentUserID={currentUser.id}
              commentID={commentObj.id}
              docID={docID}
            />
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
