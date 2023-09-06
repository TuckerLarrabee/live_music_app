import { useEffect, useState, setState } from "react";
import "../styles/BandsColumn.css";
import { countShows, countUniqueShowsByYear } from "../utils.js";
import SearchInput from "./Search";

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

  const divStyle = {
    background: "linear-gradient(to right, #EAEAEA, #EAEAEA)",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    transition: "background-size 0.25s linear",
  };
  const testDivStyle = {
    background: "linear-gradient(to right, #EAEAEA, #EAEAEA)",
    backgroundSize: "0 100%",
    backgroundRepeat: "no-repeat",
    transition: "background-size 0.25s linear",
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
          <li
            key={index}
            style={highlightedBand == name ? divStyle : testDivStyle}
          >
            <a id={name} onClick={getSpecificArtist}>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default BandsColumn;
