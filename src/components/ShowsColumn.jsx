import { useState, useEffect } from "react";
import "../styles/ShowsColumn.css";
import { divStyle, testDivStyle } from "../styles/commonStyles";

const ShowsColumn = ({
  showsColumnData,
  specificArtistRecordings,
  setRecordingDetailsColumnData,
}) => {
  const [highlightedShow, setHighlightedShow] = useState(null);

  useEffect(() => {
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

    specificArtistRecordings.forEach((yearData) => {
      if (showDate == yearData.Date) {
        specificShowsForYearArr.push(yearData);
      }
    });
    setRecordingDetailsColumnData(specificShowsForYearArr);
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
                <li
                  className="showLi"
                  key={index}
                  id={name.date}
                  onClick={getSpecificShowsRecordings}
                >
                  <div className="specificShowListItem" id={name.date}>
                    <div className="dateLocationDiv" id={name.date}>
                      <a id={name.date}>{name.date}</a>
                      <div id={name.date} className="venueCityDiv">
                        <p id={name.date} className="venue">
                          {name.venue}
                        </p>
                        <p id={name.date} className="cityState">
                          {name.city + ", " + name.state}
                        </p>
                      </div>
                    </div>
                    <div className="numberRecordingDiv" id={name.date}>
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
