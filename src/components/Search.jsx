import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../styles/Search.css";

const SearchInput = ({ filterBands, bandNames }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchedItems = bandNames.filter((item) =>
    item.toLowerCase().startsWith(searchQuery)
  );

  useEffect(() => {
    if (!searchQuery.length) {
      filterBands(bandNames);
    }

    if (bandNames.length != searchedItems.length) {
      filterBands(searchedItems);
    }
  }, [searchQuery]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleDelete = () => {
    setSearchQuery("");
  };

  return (
    <div className="content">
      <div className="search">
        <input
          onChange={handleInputChange}
          type="text"
          value={searchQuery}
          className="search__input"
          aria-label="search"
          placeholder="Search bands..."
        ></input>
        <button className="deleteBtn">
          <svg
            onClick={handleDelete}
            className="delete"
            viewBox="0 0 640 512"
            width="100"
            title="backspace"
          >
            <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
          </svg>
        </button>
        <button className="search__submit" aria-label="submit search">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
