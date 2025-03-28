import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
        <Routes>
          <Route path='/*' element={<App />} ></Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);