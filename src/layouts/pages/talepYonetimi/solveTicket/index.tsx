import React from 'react'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { ObjectPageTitle } from "@ui5/webcomponents-react";
import CreateRequest from '../createTicket';
import { useParams } from 'react-router-dom';

function solveTicket() {
  
    
  return (
  <CreateRequest isSolveTicket={true}  />
  );
}

export default solveTicket;
