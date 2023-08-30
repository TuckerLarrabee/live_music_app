import { useEffect } from "react";
import "../styles/RecordingDetailsColumn.css";
import audioSrc2 from "../assets/Andrew_Bird_7-11-12_If_I_Needed_You_Lewis_Ginter_Richmond_VA.wav";

const RecordingDetailsColumn = ({
  showsColumnData,
  recordingDetailsColumnData,
  setNowPlayingBannerData,
  setAudioSrc,
}) => {
  useEffect(() => {}, [showsColumnData]);

  useEffect(() => {}, [recordingDetailsColumnData]);

  const setNowPlaying = (event) => {
    let clickedRecording = recordingDetailsColumnData[event.target.id];
    // This is how to setAudio source to clicked recordings audio file
    // setAudioSrc(clickedRecording.AudioLink)
    setAudioSrc(audioSrc2);
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
                <div id="recordingDetailsDiv">
                  <div id="dateVenueDiv">
                    <p>Date: {name.Date} </p>
                    <p>Venue: {name.Venue} </p>
                  </div>
                  <p>Mic: {name.Mic} </p>
                  <p>Recording Deck: {name.RecordingDeck}</p>
                  <p>Recording Format: {name.RecordingFormat}</p>
                  <p>Notes: {name.Comments} </p>
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
                  <button id={index} onClick={setNowPlaying}>
                    Play
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
    </aside>
  );
};

export default RecordingDetailsColumn;
