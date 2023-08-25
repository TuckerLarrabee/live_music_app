import { useEffect, useState } from "react";
import "../styles/BandsColumn.css";
import { countShows, countUniqueShowsByYear } from "../utils.js";

const BandsColumn = ({
  bandNames,
  sheetData,
  setSpecificArtistRecordingsArray,
  setShowsColumnData,
  setYearShowRecordingCounts,
}) => {
  const getSpecificArtist = (event) => {
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

    let showCountSet = new Set(showCountArr);
    let uniqueShowCountArr = Array.from(showCountSet);
    let monthDayStringArray = [];
    uniqueShowCountArr.forEach((show) => {
      let arg = show.split("/");
      arg.pop();
      monthDayStringArray.push(arg.join("/"));
    });

    if (yearCountSet.size === 1) {
      setYearShowRecordingCounts(yearDataArr);
      setShowsColumnData(specificArtistArray);
      setSpecificArtistRecordingsArray(specificArtistArray);
    } else {
      setSpecificArtistRecordingsArray(specificArtistArray);
      setYearShowRecordingCounts(yearDataArr);
    }
  };

  return (
    <aside id="bandContainer">
      <h1>Bands: </h1>
      <ul>
        {bandNames.length
          ? bandNames.map((name, index) => (
              <li key={index}>
                <a onClick={getSpecificArtist}>{name}</a>
              </li>
            ))
          : null}
      </ul>
    </aside>
  );
};

export default BandsColumn;
