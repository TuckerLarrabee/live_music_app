import React from "react";
import '../styles/NowPlaying.css'
// const audioSrc = require("../assets/Los_Lobos_2-26-23_Paramount_Charlottesville.wav")
// import audioSrc from "../assets/Los_Lobos_2-26-23_Paramount_Charlottesville.wav"

const NowPlaying = () => {
  return (
    <div id="nowPlayingContainer">
      <div className="audioContainer">
        <div className="audioInfo">
          <h2 className="artistName">Los Lobos</h2>
          <div className="concertDetails">
            <p>Paramount Theatre</p>
            <p>2/26/2023</p>
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
