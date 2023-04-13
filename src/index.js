import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { AuthContextProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ServiceProvider } from "./Context";
import AddEvents from "./components/Events/AddEvents";
import ViewEvents from "./components/Events/ViewEvents";
import EditComittee from "./components/Events/EditCommittee";
import AddSponsers from "./components/Sponsers/AddSponsers";
import ViewSponsers from "./components/Sponsers/ViewSponsers";
import AddRequest from "./components/Requests/AddRequest";
import ViewRequests from "./components/Requests/ViewRequests";



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
            path="/add-event"
            element={
              <ProtectedRoute>
                <AddEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-events"
            element={
              <ProtectedRoute>
                <ViewEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <ProtectedRoute>
                <EditComittee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-sponsers"
            element={
              <ProtectedRoute>
                <AddSponsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-sponsers"
            element={
              <ProtectedRoute>
                <ViewSponsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-requests"
            element={
              <ProtectedRoute>
              <AddRequest/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-requests"
            element={
              <ProtectedRoute>
              <ViewRequests/>
              </ProtectedRoute>
            }
          />

        </Routes>
      </ServiceProvider>
    </AuthContextProvider>
  </BrowserRouter>
);