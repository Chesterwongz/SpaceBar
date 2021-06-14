import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../FireStore";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const CumulativeFlowChart = () => {
  let { projectID } = useParams();
  const [kanbanData, setKanbanData] = useState([]);
  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .collection("cumulativeflow")
      .orderBy("id")
      .get()
      .then((query) => {
        const data = [];
        query.forEach((doc) => {
          data.push(doc.data());
        });
        setKanbanData(data);
      });
  }, []);

  const formatData = (data) => {
    const result = [];
    for (const i of data) {
      const obj = {};
      obj["date"] = i.id;

      obj["Todo"] = i.statuses["list-1"];
      obj["Doing"] = i.statuses["list-2"];
      obj["Done"] = i.statuses["list-3"];
      result.push(obj);
    }
    console.log(result);
    return result;
  };
  return (
    <div>
      <LineChart
        width={730}
        height={250}
        data={formatData(kanbanData)}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Todo" stroke="#8884d8" />
        <Line type="monotone" dataKey="Doing" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Done" stroke="#80ced6" />
      </LineChart>
    </div>
  );
};

export default CumulativeFlowChart;
