// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from "./pages/SearchPage.jsx";
import MatchPage from "./pages/MatchPage.jsx";

function App() {

  return (
   <Routes>
       <Route path="/" element={<LoginPage />} />\
       <Route path='/search' element={<SearchPage />} />
       <Route path ='/match' element={<MatchPage />} />
   </Routes>
  );
}

export default App
