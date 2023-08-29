import React, { useEffect, useState } from "react";
import "../styles/NowPlaying.css";

// const audioSrc = require("../assets/Los_Lobos_2-26-23_Paramount_Charlottesville.wav")
// import audioSrc from "../assets/Los_Lobos_2-26-23_Paramount_Charlottesville.wav"

const NowPlaying = ({ recordingDetailsColumnData, nowPlayingBannerData }) => {
  const [state, setState] = useState({
    artistName: "Los Lobos",
    venue: "Paramount Theatre",
    date: "2/26/2023",
    comments: "",
  });

  useEffect(() => {
    setNowPlayingData();
  }, [nowPlayingBannerData]);

  const setNowPlayingData = () => {
    setState({
      artistName: nowPlayingBannerData.Band,
      venue: nowPlayingBannerData.Venue,
      date: nowPlayingBannerData.Date,
      comments: nowPlayingBannerData.Comments,
    });
  };

  // {nowPlayingBannerData.length ? nowPlayingBannerData.Band : null}

  return (
    <div id="nowPlayingContainer">
      <div className="audioContainer">
        <div className="audioInfo">
          <div id="nameVenueDiv">
            <h2 className="artistName">{state.artistName}</h2>
            <p style={{zIndex: 999}}>{state.venue}</p>
          </div>
          <div className="concertDetails">
            <p>{state.comments}</p>
            <p>{state.date}</p>
            {/*add comment here for like set 2 or set 1 */}
          </div>
        </div>
        <audio
          controls
          id="audio"
          // src={audioSrc}
        ></audio>
      </div>
    </div>
  );
};

export default NowPlaying;
