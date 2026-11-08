import { useEffect, useState } from "react";
import { buildShowList } from "../utils.js";
import "../styles/YearsColumn.css";

const YearsColumn = ({
  specificArtistRecordings,
  setShowsColumnData,
  yearShowRecordingCounts,
  setRecordingDetailsColumnData,
  showMobileView,
  linkedSelection,
}) => {
  const [highlightedYear, setHighlightedYear] = useState(null);

  useEffect(() => {
    setHighlightedYear(null);
    if (yearShowRecordingCounts.length == 1) {
      setTimeout(() => {
        if (specificArtistRecordings[0].Date.split('/')[2][0] == 7 || specificArtistRecordings[0].Date.split('/')[2][0] == 8 || specificArtistRecordings[0].Date.split('/')[2][0] == 9) {
          setHighlightedYear("19" + specificArtistRecordings[0].Date.slice(-2))
        } else {
          setHighlightedYear("20" + specificArtistRecordings[0].Date.slice(-2));
        }
      }, 280);

      setShowsColumnData(buildShowList(specificArtistRecordings));
    } else {
      setHighlightedYear(null);
    }
  }, [specificArtistRecordings]);

  // Runs after the reset above, so a shared link's year stays highlighted
  useEffect(() => {
    if (linkedSelection?.year) {
      setHighlightedYear(linkedSelection.year);
    }
  }, [linkedSelection]);

  const getSpecificShows = (year) => {
    setHighlightedYear(year);

    let specificShowsForYearArr = [];
    let clickedYear = year.slice(-2);
    specificArtistRecordings.forEach((yearData) => {
      if (clickedYear == yearData.Date.slice(-2)) {
        specificShowsForYearArr.push(yearData);
      }
    });

    const uniqueShowListArr = buildShowList(specificShowsForYearArr);
    const numberOfShows = uniqueShowListArr.length;
    if (numberOfShows == 1) {
      setRecordingDetailsColumnData(specificShowsForYearArr);
    }
    setShowsColumnData(uniqueShowListArr);
    showMobileView(numberOfShows == 1 ? "details" : "shows");
  };

  const divStyle = {
    background: "linear-gradient(to right, #615b5b, #615b5b)",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    transition: "background-size 0.25s linear",
  };
  const testDivStyle = {
    background: "linear-gradient(to right, #615b5b, #615b5b)",
    backgroundSize: "0 100%",
    backgroundRepeat: "no-repeat",
    transition: "background-size 0.25s linear",
  };
  return (
    <aside id="yearContainer">
        <h1>Years: </h1>
      <ul>
        {yearShowRecordingCounts.length
          ? yearShowRecordingCounts.map((name, index) => (
              <div key={index} className="yearParentDiv">
                <div
                  style={highlightedYear == name.year ? divStyle : testDivStyle}
                  className="yearSiblingDiv"
                ></div>
                <li key={index} onClick={() => getSpecificShows(name.year)}>
                  <div id="specificYearListItem">
                    <a id={name.year}>{name.year}</a>
                    <div id="specificYearData">
                      <p id="numberOfShows">
                        {name.showCount > 1
                          ? name.showCount + " shows"
                          : name.showCount + " show"}
                      </p>
                      <p id="numberOfRecordings">
                        {name.recordingCount > 1
                          ? name.recordingCount + " recordings"
                          : name.recordingCount + " recording"}
                      </p>
                    </div>
                  </div>
                </li>
              </div>
            ))
          : null}
      </ul>
    </aside>
  );
};

export default YearsColumn;
