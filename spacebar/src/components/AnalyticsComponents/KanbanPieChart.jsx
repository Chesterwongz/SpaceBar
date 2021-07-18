import React, { useEffect, useState } from "react";
import { db } from "../../FireStore";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const KanbanPieChart = () => {
  let { projectID } = useParams();
  const [pieData, setPieData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .collection("tasks")
      .where("status", "!=", "Archived")
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          const priority = doc.data().priority;
          //if priority not in data, add a new slice of pie
          const keys = data.map((obj) => obj.name);
          if (!keys.includes(priority)) {
            data.push({
              name: priority,
              value: 0,
            });
          }
          for (const obj of data) {
            if (obj.name === priority) {
              obj.value++;
            }
          }
        });
        setPieData(data);
      });
  }, [projectID]);
  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={pieData}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default KanbanPieChart;
