import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="업체명으로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="input-group-text">
          <i className="fas fa-search"></i>
        </span>
      </div>
    </div>
  );
}

export default SearchBar; 