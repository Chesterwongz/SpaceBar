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
      .collection("kanbanBacklog")
      .orderBy("date")
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
      const d = new Date(0);
      d.setUTCMilliseconds(i.date);
      obj["date"] = d.toString().slice(0, 15);
      obj["toDo"] = i.toDo;
      obj["doing"] = i.doing;
      obj["done"] = i.done;
      result.push(obj);
    }
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
        <Line type="monotone" dataKey="toDo" stroke="#8884d8" />
        <Line type="monotone" dataKey="doing" stroke="#82ca9d" />
        <Line type="monotone" dataKey="done" stroke="#80ced6" />
      </LineChart>
    </div>
  );
};

export default CumulativeFlowChart;
