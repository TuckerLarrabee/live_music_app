import { useEffect, useState } from "react";
import { countShows } from "../utils.js";
import "../styles/YearsColumn.css";

const YearsColumn = ({
  specificArtistRecordings,
  setShowsColumnData,
  yearShowRecordingCounts,
  setRecordingDetailsColumnData,
}) => {
  const [highlightedYear, setHighlightedYear] = useState(null);

  useEffect(() => {
    setHighlightedYear(null);
    if (yearShowRecordingCounts.length == 1) {
      setTimeout(() => {
        console.log(
          "🚀 ~ file: YearsColumn.jsx:11 ~ specificArtistRecordings:",
          "20" + specificArtistRecordings[0].Date.slice(-2)
        );
        setHighlightedYear("20" + specificArtistRecordings[0].Date.slice(-2));
      }, 280);

      let specificShowDateArr = [];
      specificArtistRecordings.forEach((showdate) => {
        specificShowDateArr.push(showdate.Date);
      });
      let specificShowCount = countShows(specificShowDateArr);
      const uniqueShowListArr = [];
      const dateSet = new Set();

      for (let i = 0; i < specificArtistRecordings.length; i++) {
        dateSet.add(specificArtistRecordings[i].Date);
        if (i === specificArtistRecordings.length - 1) {
          const uniqueShowArr = Array.from(dateSet);
          uniqueShowArr.forEach((newShowObj) => {
            uniqueShowListArr.push({
              date: newShowObj,
              venue: specificArtistRecordings[i].Venue,
              city: specificArtistRecordings[i].City,
              state: specificArtistRecordings[i].State,
            });
          });
        }
        if (uniqueShowListArr.length) {
          uniqueShowListArr.forEach((show) => {
            specificArtistRecordings.forEach((showData) => {
              if (show.date === showData.Date) {
                show.venue = showData.Venue;
                show.city = showData.City;
                show.state = showData.State;
                show.recordingCount = specificShowCount[show.date];
              }
            });
          });
        }
      }
      setShowsColumnData(uniqueShowListArr);
    } else {
      setHighlightedYear(null);
    }
  }, [specificArtistRecordings]);

  const getSpecificShows = (event) => {
    // do similar approach as in BandsColumn.jsx
    // to grab index id from event.target
    let yearLiIndex = event.target.id;
    setHighlightedYear(yearLiIndex);

    let specificShowsForYearArr = [];
    let clickedYear = event.target.textContent.slice(-2);
    specificArtistRecordings.forEach((yearData) => {
      if (clickedYear == yearData.Date.slice(-2)) {
        specificShowsForYearArr.push(yearData);
      }
    });
    let specificShowDateArr = [];

    specificShowsForYearArr.forEach((date) => {
      specificShowDateArr.push(date.Date);
    });
    let specificShowCount = countShows(specificShowDateArr);

    const uniqueShowListArr = [];
    const dateSet = new Set();
    for (let i = 0; i < specificShowsForYearArr.length; i++) {
      dateSet.add(specificShowsForYearArr[i].Date);
      if (i === specificShowsForYearArr.length - 1) {
        const uniqueShowArr = Array.from(dateSet);
        uniqueShowArr.forEach((newShowObj) => {
          uniqueShowListArr.push({
            date: newShowObj,
            venue: specificShowsForYearArr[i].Venue,
            city: specificShowsForYearArr[i].City,
            state: specificShowsForYearArr[i].State,
          });
        });
      }

      if (uniqueShowListArr.length) {
        uniqueShowListArr.forEach((show) => {
          specificShowsForYearArr.forEach((showData) => {
            if (show.date === showData.Date) {
              show.venue = showData.Venue;
              show.city = showData.City;
              show.state = showData.State;
              show.recordingCount = specificShowCount[show.date];
            }
          });
        });
      }
    }

    const numberOfShows = Object.keys(specificShowCount).length;
    if (numberOfShows == 1) {
      setRecordingDetailsColumnData(specificShowsForYearArr);
    }
    setShowsColumnData(uniqueShowListArr);
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
              <div key={index}  className="yearParentDiv">
                <div style={highlightedYear == name.year ? divStyle : testDivStyle} className="yearSiblingDiv"></div>
                <li
                  key={index}
                  onClick={getSpecificShows}
                >
                  <div id="specificYearListItem">
                    <a id={name.year} >
                      {name.year}
                    </a>
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
