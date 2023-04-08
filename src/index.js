import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { AuthContextProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ServiceProvider } from "./Context";
import AddComittee from "./components/Committee/AddComittee";
import ViewCommitte from "./components/Committee/ViewCommittee";
import EditComittee from "./components/Committee/EditCommittee";
import DisbaledCommitte from "./components/Committee/DisabledCommittee";
import ViewCommitteLogs from "./components/Committee/ViewCommitteeLogs";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <ServiceProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-committee"
            element={
              <ProtectedRoute>
                <AddComittee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-committees"
            element={
              <ProtectedRoute>
                <ViewCommitte />
              </ProtectedRoute>
            }
          />
           <Route
            path="/disabled-committees"
            element={
              <ProtectedRoute>
                <DisbaledCommitte />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-committee/:email"
            element={
              <ProtectedRoute>
                <EditComittee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-logs/:email"
            element={
              <ProtectedRoute>
                <ViewCommitteLogs />
              </ProtectedRoute>
            }
          />

        </Routes>
        
      </ServiceProvider>
    </AuthContextProvider>
  </BrowserRouter>
);