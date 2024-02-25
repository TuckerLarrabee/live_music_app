import { useEffect, useState } from "react";
import "../styles/RecordingDetailsColumn.css";
import { divStyle, testDivStyle, triangle, triangleClicked } from "../styles/commonStyles";

const RecordingDetailsColumn = ({
  recordingDetailsColumnData,
  setNowPlayingBannerData,
  setAudioSrc,
}) => {
  const [highlightedRecording, setHighlightedRecording] = useState(null);

  useEffect(() => {
    setHighlightedRecording(null);
  }, [recordingDetailsColumnData]);

  const setNowPlaying = (event) => {
    let clickedRecording = recordingDetailsColumnData[event.target.id];
    console.log("🚀 ~ setNowPlaying ~ clickedRecording:", clickedRecording)
    setHighlightedRecording(event.target.id);
    setAudioSrc(clickedRecording.AudioLink);
    setNowPlayingBannerData(clickedRecording);
  };

  return (
    <aside id="recordingDetailsContainer">
      <h1>Recording Details: </h1>
      <div>
        {recordingDetailsColumnData.length
          ? recordingDetailsColumnData.map((name, index) => (
              <div key={index}>
                <div id="recordingBanner">
                  SOURCE {index + 1} of {recordingDetailsColumnData.length}
                </div>
                <div className="recordingParentDiv">
                  <div
                    style={highlightedRecording == index ? divStyle : testDivStyle}
                    className="recordingLiDiv"
                  ></div>
                  <div className="detailsParentDiv" key={index}>
                    <div id="recordingDetailsDiv">
                      <div className="recordingInfoParentDiv">
                        <div className="recordingInfoDiv">
                          <p>Venue: {name.Venue} </p>
                          <p>Mic: {name.Mic} </p>
                          <p>Recording Deck: {name.RecordingDeck}</p>
                          <p>Recording Format: {name.RecordingFormat}</p>
                          <p>Notes: {name.Comments} </p>
                        </div>
                        <div className="dateAndPlayDiv">
                          <p>Date: {name.Date} </p>
                          <button
                            style={highlightedRecording == index? triangleClicked : triangle}
                            onClick={setNowPlaying}
                            id={index}
                            className="triangle"
                          ></button>
                        </div>
                      </div>
                      <div id="setlistDiv">
                        <p>Setlist:</p>
                        <div>
                          <a style={{ textDecoration: "none" }} target="_blank" href={name.setlistFMlink}>
                            {name.setlistFMlink}
                          </a>
                        </div>
                      </div>
                      <div id="paddingDiv"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </aside>
  );
};

export default RecordingDetailsColumn;
