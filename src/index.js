import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
//import App from './App';
//import SideBar from './components/sidebar/SideBar';
import Home from './pages/home/Home';
import reportWebVitals from './reportWebVitals';
import Login from './components/login';
import Game from './pages/game/Game';
import Victory from './pages/victory/Victory';
import SinkOrSail from './pages/sinkorsail/SinkOrSail';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/sinkorsail" element={<SinkOrSail />} />
      <Route path='/game/:gameId' element={<Game />} />
      <Route path='/victory/:gameId' element={<Victory />} />

    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
