import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        the JIUM
      </Link>
      <div className="nav-links">
        <Link to="/electric" className="nav-link">전기협력사</Link>
        <Link to="/telecom" className="nav-link">통신협력사</Link>
        <Link to="/fire" className="nav-link">소방협력사</Link>
        <div className="nav-item dropdown">
          <span className="nav-link">적격심사</span>
          <div className="dropdown-content">
            <Link to="/evaluation/pps-under-50" className="dropdown-item">
              조달청50억미만
            </Link>
            <Link to="/evaluation/mois-under-50" className="dropdown-item">
              행안부50억미만
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 