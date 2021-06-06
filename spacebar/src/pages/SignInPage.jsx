import React, { useState } from "react";
import NavBar from "../components/SignInPageComponents/NavBar";
import Main from "../components/SignInPageComponents/Main";
import SideBar from "../components/SignInPageComponents/SideBar";
import Features from "../components/SignInPageComponents/Features";
import Signin from "../components/SignInPageComponents/Signin";

export default function SignInPage() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  return (
    <>
      <SideBar toggleSideBar={toggleSideBar} sideBarOpen={sideBarOpen} />
      <NavBar toggleSideBar={toggleSideBar} />
      <Main />
      <Features />
      <Signin />
    </>
  );
}
