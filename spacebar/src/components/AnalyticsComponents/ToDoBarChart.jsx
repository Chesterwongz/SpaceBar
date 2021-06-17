import React, { useEffect, useState } from "react";
import { db } from "../../FireStore";
import { useParams } from "react-router-dom";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip } from "recharts";

const ToDoBarChart = () => {
  let { projectID } = useParams();
  const [toDoItems, setToDoItems] = useState([]);

  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .collection("tasks")
      .where("status", "==", "list-1")
      .get()
      .then((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setToDoItems(items);
      });
  }, [projectID]);

  const getItemTimes = (toDoItems) => {
    return toDoItems.map(
      (item) => (Date.now() - item.createdAt.seconds * 1000) / (1000 * 60 * 60)
    );
  };

  const getItemNames = (toDoItems) => {
    return toDoItems.map((item) => item.title);
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
        data={formatData(getItemNames(toDoItems), getItemTimes(toDoItems))}
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
