import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import "../styles/RecordingDetailsColumn.css";
import { divStyle, testDivStyle, triangle, triangleClicked } from "../styles/commonStyles";
import { buildShareUrl } from "../utils.js";

const RecordingDetailsColumn = ({
  recordingDetailsColumnData,
  setNowPlayingBannerData,
  setAudioSrc,
  linkedSelection,
}) => {
  const [highlightedRecording, setHighlightedRecording] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    setHighlightedRecording(null);
    setCopiedIndex(null);
  }, [recordingDetailsColumnData]);

  useEffect(() => {
    if (linkedSelection?.source) {
      setHighlightedRecording(linkedSelection.source - 1);
    }
  }, [linkedSelection]);

  const shareRecording = async (recording, index) => {
    const url = buildShareUrl({
      band: recording.Band,
      date: recording.Date,
      source: index + 1,
    });
    const title = `${recording.Band} – ${recording.Date} – ${recording.Venue}`;

    // Phones get the native share sheet; desktop copies the link
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (navigator.share && isTouchDevice) {
      try {
        // The link goes inside `text` rather than in `url`: iOS sends only the url to
        // Messages when both are given, dropping the description. Messages still
        // turns the address in the text into a link preview.
        await navigator.share({ text: `${title}\n${url}` });
      } catch {
        // Share sheet dismissed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard needs https (or localhost); fall back to a manual copy
      window.prompt("Copy this link:", url);
    }
  };

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
                          <button
                            className="shareBtn"
                            onClick={() => shareRecording(name, index)}
                            aria-label="Share this recording"
                          >
                            <FontAwesomeIcon icon={faArrowUpFromBracket} />
                            <span>{copiedIndex === index ? "Copied!" : "Share"}</span>
                          </button>
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
