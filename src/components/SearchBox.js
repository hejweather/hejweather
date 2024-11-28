import React from "react";

const SearchBox = ({ query, onQueryChange, onSearch }) => (
  <div className="search-box">
    <input
      type="text"
      className="search-bar"
      placeholder="Search..."
      onChange={onQueryChange}
      value={query}
      onKeyPress={onSearch}
    />
  </div>
);

export default SearchBox;
