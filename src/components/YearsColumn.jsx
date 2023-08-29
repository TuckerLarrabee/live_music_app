import { useEffect, useState } from "react";
import { countShows, countUniqueShowsByYear } from "../utils.js";
import "../styles/YearsColumn.css";

const YearsColumn = ({
  specificArtistRecordings,
  setShowsColumnData,
  yearShowRecordingCounts,
  setRecordingDetailsColumnData
}) => {
  useEffect(() => {
    if (yearShowRecordingCounts.length < 2) {
      // console.log("🚀 ~ file: YearsColumn.jsx:13 ~ useEffect ~ yearShowRecordingCounts:", yearShowRecordingCounts)
      let specificShowDateArr = [];
      specificArtistRecordings.forEach((showdate) => {
        specificShowDateArr.push(showdate.Date);
      });
      let specificShowCount = countShows(specificShowDateArr);
      const uniqueShowListArr = [];
      const dateSet = new Set();

      for (let i = 0; i < specificArtistRecordings.length; i++) {
        dateSet.add(specificArtistRecordings[i].Date)
        if (i === specificArtistRecordings.length-1) {
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
    }
  }, [specificArtistRecordings]);

  const getSpecificShows = (event) => {
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
    
    const numberOfShows = Object.keys(specificShowCount).length
    if (numberOfShows == 1) {
      setRecordingDetailsColumnData(specificShowsForYearArr)
    }
    setShowsColumnData(uniqueShowListArr);
  };

  return (
    <aside id="yearContainer">
      <h1>Years: </h1>
      <ul>
        {yearShowRecordingCounts.length
          ? yearShowRecordingCounts.map((name, index) => (
              <li key={index}>
                <div id="specificYearListItem">
                  <a onClick={getSpecificShows}>{name.year}</a>
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
            ))
          : null}
      </ul>
    </aside>
  );
};

export default YearsColumn;
