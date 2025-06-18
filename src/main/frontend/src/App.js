import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ElectricCompany from './pages/ElectricCompany';
import TelecomCompany from './pages/TelecomCompany';
import FireCompany from './pages/FireCompany';
import ElectricEvaluation from './pages/evaluation/ElectricEvaluation';
import TelecomEvaluation from './pages/evaluation/TelecomEvaluation';
import FireEvaluation from './pages/evaluation/FireEvaluation';
import PpsUnder50Evaluation from './pages/evaluation/PpsUnder50Evaluation';
import MoisUnder50Evaluation from './pages/evaluation/MoisUnder50Evaluation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<ElectricCompany />} />
          <Route path="/electric" element={<ElectricCompany />} />
          <Route path="/telecom" element={<TelecomCompany />} />
          <Route path="/fire" element={<FireCompany />} />
          <Route path="/evaluation/electric" element={<ElectricEvaluation />} />
          <Route path="/evaluation/telecom" element={<TelecomEvaluation />} />
          <Route path="/evaluation/fire" element={<FireEvaluation />} />
          <Route path="/evaluation/pps-under-50" element={<PpsUnder50Evaluation />} />
          <Route path="/evaluation/mois-under-50" element={<MoisUnder50Evaluation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
