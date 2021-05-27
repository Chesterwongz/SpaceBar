import React from "react";
import { db } from "../FireStore";
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../utils/Context";
import { Link } from "react-router-dom";

export default function HomePage() {
  const currentUser = useContext(CurrentUserContext);
  const [projects, setProjects] = useState([]);
  // useEffect(() => {
  //   var unSubscribe = db
  //     .collection("Projects")
  //     .doc("project-1")
  //     .collection("projectinfo")
  //     .doc("1OoS5xRD3l6Ih6RIDY5M")
  //     .onSnapshot((doc) => {
  //       setProject(doc.data().projectname);
  //     });
  //   return () => {
  //     unSubscribe();
  //   };
  // }, []);

  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(currentUser.id)
        .onSnapshot((doc) => {
          setProjects(doc.data().projectRef);
        });
    }
  }, [currentUser]);
  return (
    <div>
      Homepage
      <button>Add project</button>
      <div>
        <h2>Projects</h2>
        {projects.map((project, index) => {
          const link = `/${project}/board`;
          return (
            <Link to={link} key={index}>
              {project}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
