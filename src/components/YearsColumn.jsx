import { useEffect } from "react";
import "../styles/YearsColumn.css";

const YearsColumn = ({
  specificArtistRecordings,
  setShowsColumnData,
  yearShowRecordingCounts,
}) => {
  useEffect(() => {
    yearShowRecordingCounts.forEach((item) => {
      console.log(item);
    });
  }, [yearShowRecordingCounts]);

  const getSpecificShows = (event) => {
    let specificShowsForYearArr = [];
    let clickedYear = event.target.textContent.slice(-2);
    specificArtistRecordings.forEach((yearData) => {
      if (clickedYear == yearData.Date.slice(-2)) {
        specificShowsForYearArr.push(yearData);
      }
    });

    setShowsColumnData(specificShowsForYearArr);
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
