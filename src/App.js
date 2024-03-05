import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";

import ProtectedRoute from "./components/ProtectedRoute";

import RegisterPage from "./components/RegisterPage"

import MainPageContacts from "./components/MainPageContacts";

import './App.css';

function App() {
  return (
    <div className="App">	




      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/main-page-contacts" element={<ProtectedRoute><MainPageContacts /></ProtectedRoute>} />
          <Route path="/*" element={<h1>404 Page Not Found!</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
