import React, { useEffect, useState } from "react";
import { db } from "../../FireStore";
import { useParams } from "react-router-dom";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip } from "recharts";

const ToDoBarChart = () => {
  let { projectID } = useParams();
  const [backlogItems, setBacklogItems] = useState([]);
  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .collection("tasks")
      .get()
      .then((snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setBacklogItems(items);
      });
  }, [projectID]);

  const getItemTimes = (backlogItems) => {
    return backlogItems.map(
      (item) => (Date.now() - item.createdAt.seconds * 1000) / (1000 * 60 * 60)
    );
  };

  const getItemNames = (backlogItems) => {
    return backlogItems.map((item) => item.title);
  };

  const formatData = (xArray, yArray) => {
    const data = [];
    for (let i = 0; i < xArray.length; i++) {
      const obj = {};
      obj["name"] = xArray[i];
      obj["hours"] = yArray[i];
      data.push(obj);
    }
    return data;
  };
  return (
    <div>
      <BarChart
        width={730}
        height={250}
        data={formatData(
          getItemNames(backlogItems),
          getItemTimes(backlogItems)
        )}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="hours" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default ToDoBarChart;
