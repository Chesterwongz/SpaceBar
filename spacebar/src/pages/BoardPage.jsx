import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../FireStore";
import ScrumBoardPage from "./ScrumBoardPage";
import KanbanBoardPage from "./KanbanBoardPage";
export default function BoardPage() {
  const { projectID } = useParams();
  const [isScrum, setIsScrum] = useState(null);
  useEffect(() => {
    db.collection("Projects")
      .doc(projectID)
      .get()
      .then((doc) => {
        setIsScrum(doc.data().isScrum);
      });
  }, []);
  return <div>{isScrum ? <ScrumBoardPage /> : <KanbanBoardPage />}</div>;
}
