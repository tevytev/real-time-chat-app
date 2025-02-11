import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { UserProvider } from "./routes/userContext/UserContext";
import "./App.css";
import Auth from "./routes/auth/Auth";
import Root from "./routes/Root";
import Dashboard from "./routes/dashboard/Dashboard";
import FamilySetup from "./routes/familySetup/FamilySetup";
import io from "socket.io-client";
import axios from "./api/axios";
const URL = "/api/message/67738646d80c810aa89bda41";

function App() {

  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="/register" element={<Auth />} />
          <Route path="/familysetup" element={<FamilySetup />} />
          <Route path="/home" element={<Dashboard />} />
        </Route>
      </Routes>
      </UserProvider>
    </>
  );
}

export default App;
