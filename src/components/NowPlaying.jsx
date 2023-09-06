import React, { useEffect, useState } from "react";
import "../styles/NowPlaying.css";

const NowPlaying = ({ nowPlayingBannerData, audioSrc }) => {
  const [state, setState] = useState({
    artistName: "Los Lobos",
    venue: "Paramount Theatre",
    date: "2/26/2023",
    comments: "",
  });

  useEffect(() => {
    // console.log(audioSrc);
  }, [audioSrc]);

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

  return (
    <div id="nowPlayingContainer">
      <div className="audioContainer">
        <div className="audioInfo">
          <div id="nameVenueDiv">
            <h2 className="artistName">
              {state.artistName ? state.artistName : "Los Lobos"}
            </h2>
            <p style={{ zIndex: 999 }}>
              {state.venue ? state.venue : "Colisuem"}
            </p>
          </div>
          <div className="concertDetails">
            <p>{state.date ? state.date : "11/11/2001"}</p>
            <p style={{ zIndex: 999 }}>{state.comments}</p>
          </div>
        </div>
        <audio controls id="audio" src={audioSrc}></audio>
      </div>
    </div>
  );
};

export default NowPlaying;
