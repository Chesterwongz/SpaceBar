import React, { useEffect } from "react";
import ToDoBarChart from "../components/AnalyticsComponents/ToDoBarChart";
import CumulativeFlowChart from "../components/AnalyticsComponents/CumulativeFlowChart";
import KanbanPieChart from "../components/AnalyticsComponents/KanbanPieChart";
import { db, updateCumulativeFlowDate } from "../FireStore";
import { useParams } from "react-router-dom";

const AnalyticsPage = () => {
  const { projectID } = useParams();
  return (
    <div>
      <h1>Analytics </h1>
      <div>
        <h3>Average age of tasks in hours</h3>
        <ToDoBarChart />
      </div>
      <div>
        <h3>Cumulative flow chart</h3>
        <CumulativeFlowChart />
      </div>
      <div>
        <h3>Priority breakdown of tasks</h3>
        <KanbanPieChart />
      </div>
    </div>
  );
};

export default AnalyticsPage;
