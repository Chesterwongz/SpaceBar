import React, { useEffect, useState } from "react";
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
    //query
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
  }, [projectID]);

  const formatData = (data) => {
    const result = [];
    for (const i of data) {
      const obj = {};
      const date = i.id.toString();
      //Convert to dd/mm/yy
      const formatedDate =
        date.slice(4, 6) + "/" + date.slice(2, 4) + "/" + date.slice(0, 2);
      obj["date"] = formatedDate;

      obj["Todo"] = i.statuses["list-1"];
      obj["Doing"] = i.statuses["list-2"];
      obj["Done"] = i.statuses["list-3"];
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
        <Line type="monotone" dataKey="Todo" stroke="#8884d8" />
        <Line type="monotone" dataKey="Doing" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Done" stroke="#80ced6" />
      </LineChart>
    </div>
  );
};

export default CumulativeFlowChart;
