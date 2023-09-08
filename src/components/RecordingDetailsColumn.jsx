import { useEffect, useState } from "react";
import "../styles/RecordingDetailsColumn.css";

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
    console.log(
      "🚀 ~ file: RecordingDetailsColumn.jsx:19 ~ setNowPlaying ~ event:",
      event.target
    );
    let clickedRecording = recordingDetailsColumnData[event.target.id];
    console.log(
      "🚀 ~ file: RecordingDetailsColumn.jsx:20 ~ setNowPlaying ~ clickedRecording:",
      clickedRecording
    );
    setHighlightedRecording(event.target.id);
    // setAudioSrc(audioSrc2);
    setNowPlayingBannerData(clickedRecording);
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
    transition: "background-size 0.15s linear",
  };

  const triangle = {
    width: 0,
    height: 0,
    outline: "none",
    boxShadow: "none",
    borderTop: "20px solid transparent",
    borderBottom: "20px solid transparent",
    borderLeft: "25px solid rgb(39 155 188)",
  };
  const triangleClicked = {
    width: 0,
    height: 0,
    outline: "none",
    boxShadow: "none",
    borderTop: "20px solid transparent",
    borderBottom: "20px solid transparent",
    borderLeft: "25px solid rgb(22, 148, 11)",
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
                    style={
                      highlightedRecording == index ? divStyle : testDivStyle
                    }
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
                            style={
                              highlightedRecording == index
                                ? triangleClicked
                                : triangle
                            }
                            onClick={setNowPlaying}
                            id={index}
                            className="triangle"
                          ></button>
                        </div>
                      </div>
                      <div id="setlistDiv">
                        <p>Setlist:</p>
                        <div>
                          <a
                            style={{ textDecoration: "none" }}
                            target="_blank"
                            href={name.setlistFMlink}
                          >
                            {name.setlistFMlink}
                          </a>
                        </div>
                      </div>
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
