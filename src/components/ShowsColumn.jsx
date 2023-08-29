import { useState, useEffect } from "react";
import { countShows, countUniqueShowsByYear } from "../utils.js";
import "../styles/ShowsColumn.css";

const ShowsColumn = ({ showsColumnData, specificArtistRecordings, setRecordingDetailsColumnData }) => {
  let showArr = [];
  let showColumnListItemObjArr = [];

  const [state, setState] = useState({
    showsData: [],
  });

  useEffect(() => {

  }, [showsColumnData]);

  const getSpecificShowsRecordings = (event) => {
    // console.log(event.target);
    let specificShowsForYearArr = [];
    let clickedYear = event.target.textContent
    console.log("🚀 ~ file: ShowsColumn.jsx:21 ~ getSpecificShowsRecordings ~ clickedYear:", clickedYear)
    specificArtistRecordings.forEach((yearData) => {
      if (clickedYear == yearData.Date) {
        specificShowsForYearArr.push(yearData);
      }
    });
    setRecordingDetailsColumnData(specificShowsForYearArr)
    

  };

  return (
    <aside id="showContainer">
      <h1>Shows: </h1>
      <ul>
        {showsColumnData.length
          ? showsColumnData.map((name, index) => (
              <li key={index}>
                <div id="specificShowListItem">
                  <div id="dateLocationDiv">
                    <a onClick={getSpecificShowsRecordings}>{name.date}</a>
                    <p id="venue">{name.venue}</p>
                    <p id="cityState">{name.city + ", " + name.state}</p>
                  </div>
                  <div id="numberRecordingDiv">
                    {name.recordingCount > 1
                      ? name.recordingCount + " recordings"
                      : name.recordingCount + " recording"}
                  </div>
                </div>
              </li>
            ))
          : null}
      </ul>
    </aside>
  );
};

export default ShowsColumn;
