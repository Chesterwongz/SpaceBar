import React from "react";
import ToDoBarChart from "../components/AnalyticsComponents/ToDoBarChart";
import CumulativeFlowChart from "../components/AnalyticsComponents/CumulativeFlowChart";
import KanbanPieChart from "../components/AnalyticsComponents/KanbanPieChart";

const AnalyticsPage = () => {
  return (
    <div>
      <h1>Analytics </h1>
      <div>
        <h3>Average age of unresolved issues in hours</h3>
        <ToDoBarChart />
      </div>
      <div>
        <h3>Cumulative flow chart</h3>
        <CumulativeFlowChart />
      </div>
      <div>
        <h3>Priority breakdown of unresolved tasks</h3>
        <KanbanPieChart />
      </div>
    </div>
  );
};

export default AnalyticsPage;
