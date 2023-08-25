import { useEffect } from "react";
import { countShows, countUniqueShowsByYear } from "../utils.js";
import "../styles/ShowsColumn.css";

const ShowsColumn = ({ showsColumnData, specificArtistRecordings }) => {
let showArr = []

  useEffect(() => {
    showsColumnData.forEach((item) => {
      showArr.push(item.Date);
    });
    let countVar = countShows(showArr)
    console.log("🚀 ~ file: ShowsColumn.jsx:13 ~ useEffect ~ countVar:", countVar)
  }, [showsColumnData]);

  return (
    <aside id="showContainer">
      <h1>Shows: </h1>
      <ul>
        {showsColumnData.length
          ? showsColumnData.map((name, index) => (
              <li key={index}>
                <div id="specificShowListItem">
                  <div id="dateLocationDiv">
                    <a onClick={(event) => console.log(event.target)}>
                      {name.Date}
                    </a>
                    <p id="venue">{name.Venue}</p>
                    <p id="cityState">{name.City + ', ' + name.State}</p>
                  </div>
                  <div id="numberRecordingDiv">
                      1 recording
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
