import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../FireStore";
import { useParams } from "react-router-dom";
import EpicList from "./EpicList";
import CircularProgress from "@material-ui/core/CircularProgress";
import EpicCalender from "./EpicCalender";

const useStyles = makeStyles((theme) => ({
  epicBoard: {
    display: "flex",
  },
}));

const Roadmapboard = () => {
  let { projectID } = useParams();
  const classes = useStyles();
  const [epicData, setEpicData] = useState();
  useEffect(() => {
    //query
    db.collection("Projects")
      .doc(projectID)
      .collection("epics")
      .orderBy("startDate")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setEpicData(data);
      });
  }, [projectID]);
  return (
    <div>
      {epicData ? (
        <div className={classes.epicBoard}>
          <EpicList epicData={epicData} />
          <EpicCalender epicData={epicData} />
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Roadmapboard;
