import { useEffect, useState } from "react";
import "../styles/BandsColumn.css";
import { countShows, countUniqueShowsByYear } from "../utils.js";

const BandsColumn = ({
  bandNames,
  sheetData,
  setSpecificArtistRecordingsArray,
  setYearShowRecordingCounts,
  setRecordingDetailsColumnData,
}) => {
  const [highlightedBand, setHighlightedBand] = useState(null);
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

    // let showCountSet = new Set(showCountArr);
    // let uniqueShowCountArr = Array.from(showCountSet);
    // let monthDayStringArray = [];
    // uniqueShowCountArr.forEach((show) => {
    //   let arg = show.split("/");
    //   arg.pop();
    //   monthDayStringArray.push(arg.join("/"));
    // });

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
      <h1>Bands: </h1>
      <ul id="bandUl">
        {bandNames.length
          ? bandNames.map((name, index) => (
              // <div className="bandLiDiv" >
              <li
                key={index}
                style={{
                  backgroundColor:
                    highlightedBand == index ? "gainsboro" : "inherit",
                }}
              >
                <a id={index} onClick={getSpecificArtist}>
                  {name}
                </a>
              </li>
              // </div>
            ))
          : null}
      </ul>
    </aside>
  );
};

export default BandsColumn;
