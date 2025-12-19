import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/Useregister";
import UserFeedback from "./pages/UserFeedback";
import ViewFeedback from "./pages/viewfeedback.jsx";
import AdminDashboard from "./pages/admin/Admindash";

import ProtectedRoute from "./components/Protected.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import UserRoute from "./components/Userroute.jsx";
import View from "./pages/admin/Viewadmin.jsx";

const App = () => {
  return (
    <Routes>
      {/* 🌐 Public routes */}
       <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

      {/* 👤 USER ROUTES */}
      <Route
        path="/user/feedback"
        element={
          <ProtectedRoute>
            <UserRoute>
              <UserFeedback />
            </UserRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-feedback"
        element={
          <ProtectedRoute>
            <UserRoute>
              <ViewFeedback />
            </UserRoute>
          </ProtectedRoute>
        }
      />

      {/* 👑 ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/feedback/:userId"
  element={
    <AdminRoute>
      < View  />
    </AdminRoute>
  }
/>
    </Routes>
  );
};

export default App;
