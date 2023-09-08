import { useState, useEffect } from "react";
import "../styles/ShowsColumn.css";

const ShowsColumn = ({
  showsColumnData,
  specificArtistRecordings,
  setRecordingDetailsColumnData,
}) => {
  const [highlightedShow, setHighlightedShow] = useState(null);

  useEffect(() => {
    // console.log("🚀 ~ file: ShowsColumn.jsx:9 ~ specificArtistRecordings:", specificArtistRecordings)
    setHighlightedShow(null);
    if (showsColumnData.length == 1 && specificArtistRecordings.length > 1) {
      setTimeout(() => {
        setHighlightedShow(showsColumnData[0].date);
      }, 280);
    } else if (showsColumnData.length == 1) {
      setTimeout(() => {
        setHighlightedShow(showsColumnData[0].date);
      }, 540);
    }
  }, [showsColumnData]);

  const getSpecificShowsRecordings = (event) => {
    let showDate = event.target.id;
    setHighlightedShow(showDate);
    let specificShowsForYearArr = [];
    let clickedYear = event.target.textContent;
    specificArtistRecordings.forEach((yearData) => {
      if (clickedYear == yearData.Date) {
        specificShowsForYearArr.push(yearData);
      }
    });
    setRecordingDetailsColumnData(specificShowsForYearArr);
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
    <aside id="showContainer">
      <h1>Shows: </h1>
      <ul>
        {showsColumnData.length
          ? showsColumnData.map((name, index) => (
              <div key={index} className="showParentDiv">
                <div
                  style={highlightedShow == name.date ? divStyle : testDivStyle}
                  className="showLiDiv"
                ></div>
                <li className="showLi" key={index}>
                  <div id="specificShowListItem">
                    <div id="dateLocationDiv">
                      <a id={name.date} onClick={getSpecificShowsRecordings}>
                        {name.date}
                      </a>
                      <div className="venueCityDiv">
                        <p id="venue">{name.venue}</p>
                        <p id="cityState">{name.city + ", " + name.state}</p>
                      </div>
                    </div>
                    <div id="numberRecordingDiv">
                      {name.recordingCount > 1
                        ? name.recordingCount + " recordings"
                        : name.recordingCount + " recording"}
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

export default ShowsColumn;
