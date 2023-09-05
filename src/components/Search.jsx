import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "../styles/Search.css";

const SearchInput = ({ searchedArtists, filterBands, bandNames }) => {
  // Define a state variable to store the current search query
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchedItems = bandNames.filter((item) =>
  item.toLowerCase().startsWith(searchQuery)
  );
  
  // useEffect(() => {
  //   console.log("🚀 ~ file: Search.jsx:8 ~ SearchInput ~ searchedArtists:", searchedArtists)
    
  // }, [searchedArtists])
  
  useEffect(() => {
    //  OPTIMIZE - NEEDS REFACTORING
    //   Bug around searching and updating highlights li's
    
    if (!searchQuery.length) {
      console.log("🚀 ~ file: Search.jsx:14 ~ SearchInput ~ searchedItems:", searchedItems)
      console.log("🚀 ~ file: Search.jsx:23 ~ useEffect ~ bandNames:", bandNames)
      filterBands(bandNames)
    }
    
    if (bandNames.length != searchedItems.length) {
      filterBands(searchedItems)
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
      <div className="search" >
        <input
          onChange={handleInputChange}
          type="text"
          value={searchQuery}
          className="search__input"
          aria-label="search"
          placeholder="Search bands..."
        ></input>
        {/* <a className="T" href="">T</a> */}
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

    // <div className={isOpen ? "search search-open" : "search"}>
    //   <svg
    //     onClick={handleMagnifyingClick}
    //     className="search__icon"
    //     viewBox="0 0 512 512"
    //     width="95"
    //     title="search"
    //   >
    //     <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
    //   </svg>

    // </div>
  );
};

export default SearchInput;
