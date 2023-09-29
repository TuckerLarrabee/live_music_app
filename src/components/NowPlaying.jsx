import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "../styles/NowPlaying.css";

const NowPlaying = ({ nowPlayingBannerData, audioSrc }) => {
  const [state, setState] = useState({
    artistName: "Los Lobos",
    venue: "Paramount Theatre",
    date: "2/26/2023",
    comments: "",
    playing: false,
  });
  const playerRef = useRef(null);

  const playAudio = () => {
    setState((prevState) => ({ ...prevState, playing: true }));
    playerRef.current.seekTo(0);
  };

  useEffect(() => {
    setTimeout(() => {
      playAudio();
    }, 1);
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
              {state.artistName ? state.artistName : "Aimee Mann"}
            </h2>
            <p style={{ zIndex: 999 }}>
              {state.venue ? state.venue : "Tin Pan"}
            </p>
          </div>
          <div className="concertDetails">
            <p>{state.date ? state.date : "1/30/18"}</p>
            {/* <p style={{ zIndex: 999 }}>{state.comments}</p> */}
          </div>
        </div>
        <ReactPlayer
          ref={playerRef}
          style={{ width: 600, maxHeight: 28 }}
          url={audioSrc}
          controls
          id="audio"
          playing={state.playing}
        ></ReactPlayer>
      </div>
    </div>
  );
};

export default NowPlaying;
