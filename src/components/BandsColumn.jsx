import { useEffect, useState, setState } from "react";
import "../styles/BandsColumn.css";
import { countShows, countUniqueShowsByYear } from "../utils.js";
import SearchInput from "./Search";
import {divStyle, testDivStyle} from '../styles/commonStyles'

const BandsColumn = ({
  bandNames,
  sheetData,
  setSpecificArtistRecordingsArray,
  setYearShowRecordingCounts,
  setRecordingDetailsColumnData,
  setBandsSearched,
}) => {
  const [highlightedBand, setHighlightedBand] = useState(null);
  const [searchedArtists, setSearchedArtists] = useState([]);

  useEffect(() => {
    setSearchedArtists(bandNames);
  }, [bandNames]);

  useEffect(() => {}, [searchedArtists]);

  const filterBands = (searchedItems) => {
    setSearchedArtists(searchedItems);
  };

  const getSpecificArtist = (event) => {
    let bandLiIndex = event.target.id;
    setHighlightedBand(bandLiIndex);

    let specificArtistArray = [];
    let clickedArtist = event.target.textContent;

    sheetData.forEach((artist) => {
      if (clickedArtist === artist.Band) {
        specificArtistArray.push(artist);
      }
    });
    getSpecificArtistYears(specificArtistArray);
  };

  const getSpecificArtistYears = (specificArtistArray) => {
    let currentYear = new Date().getFullYear().toString().slice(-2);

    let showCountArr = [];
    specificArtistArray.forEach((show) => {
      showCountArr.push(show.Date);
    });

    let yearCountArr = [];
    showCountArr.forEach((show) => {
      yearCountArr.push(show.slice(-2));
    });
    let yearCountSet = new Set(yearCountArr);

    let yearRecordingCount = countShows(yearCountArr);
    let yearDataArr = [];
    let uniqueShows = countUniqueShowsByYear(showCountArr);
    
    
    for (let [key, value] of Object.entries(yearRecordingCount)) {
      for (let yearKey in uniqueShows) {
        if (yearKey == key) {
          if (key <= currentYear) {
            key = "20" + key;
          } else if (key > currentYear) {
            key = "19" + key;
          }
          const yearObj = {
            year: key,
            recordingCount: value,
            showCount: uniqueShows[yearKey],
          };
          
          yearDataArr.push(yearObj);
        }
      }
    }
    let previousCenturyArr = []
    let currentCenturyArr= []
    
    yearDataArr.forEach(item => {
      if (item.year < 2000) {
        previousCenturyArr.push(item)
      }
      else {
        currentCenturyArr.push(item)
      }
    })
    
    console.log("🚀 ~ file: BandsColumn.jsx:81 ~ getSpecificArtistYears ~ previousCenturyArr:", previousCenturyArr)
    console.log("🚀 ~ file: BandsColumn.jsx:83 ~ getSpecificArtistYears ~ currentCenturyArr:", currentCenturyArr)
    yearDataArr = previousCenturyArr.concat(currentCenturyArr)
    console.log("🚀 ~ file: BandsColumn.jsx:95 ~ getSpecificArtistYears ~ yearDataArr:", yearDataArr)
    
    if (yearCountSet.size === 1 && yearDataArr[0].showCount === 1) {
      setYearShowRecordingCounts(yearDataArr);
      setSpecificArtistRecordingsArray(specificArtistArray);
      setRecordingDetailsColumnData(specificArtistArray);
    } else {
      setYearShowRecordingCounts(yearDataArr);
      setSpecificArtistRecordingsArray(specificArtistArray);
      setRecordingDetailsColumnData([]);
    }
  };

  return (
    <aside id="bandContainer">
      <div id="headerDiv">
        <SearchInput
          bandNames={bandNames}
          setBandsSearched={setBandsSearched}
          filterBands={filterBands}
        ></SearchInput>
        <h1 id="bandHeaderText"> Bands:</h1>
      </div>
      <ul id="bandUl">
        {searchedArtists.map((name, index) => (
          <div
            key={index}
            onClick={getSpecificArtist}
            id={name}
            className="bandParentDiv"
          >
            <div
              className="bandLiDiv"
              style={highlightedBand == name ? divStyle : testDivStyle}
            ></div>
            <li className="bandLi" key={index}>
              <a id={name}>{name}</a>
            </li>
          </div>
        ))}
      </ul>
    </aside>
  );
};

export default BandsColumn;
