import React from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Grab the user object from the global store zuztand
  const { user } = useAuthStore();

  // If user is null (not logged in), redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child component (the outlet).
  return <Outlet />;
};

export default ProtectedRoute;
