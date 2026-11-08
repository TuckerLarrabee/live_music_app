import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import ScrollingText from "./ScrollingText";
import PlayerControls from "./PlayerControls";
import "../styles/NowPlaying.css";

const NowPlaying = ({ nowPlayingBannerData, audioSrc, isMobile }) => {
  const [state, setState] = useState({
    artistName: "Los Lobos",
    venue: "Paramount Theatre",
    date: "2/26/2023",
    comments: "",
    playing: false,
  });
  const playerRef = useRef(null);
  // Actual playback status and position, for the custom mobile controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ played: 0, duration: 0 });

  const playAudio = () => {
    setState((prevState) => ({ ...prevState, playing: true }));
    playerRef.current.seekTo(0);
  };

  // Called straight from the tap handler: iOS only allows play() during a user gesture
  const togglePlay = () => {
    const audio = playerRef.current?.getInternalPlayer();
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setState((prevState) => ({ ...prevState, playing: true }));
    } else {
      audio.pause();
      setState((prevState) => ({ ...prevState, playing: false }));
    }
  };

  const seekTo = (seconds) => {
    playerRef.current?.seekTo(seconds, "seconds");
    setProgress((prev) => ({ ...prev, played: seconds }));
  };

  useEffect(() => {
    setProgress({ played: 0, duration: 0 });
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
            {isMobile ? (
              // Narrow phone bar: show the full text, sliding it when it doesn't fit
              <>
                <ScrollingText
                  as="h2"
                  className="artistName"
                  text={state.artistName ? state.artistName : "Aimee Mann"}
                />
                <ScrollingText as="p" text={state.venue ? state.venue : "Tin Pan"} />
              </>
            ) : (
              <>
                <h2 className="artistName">
                  {state.artistName ? (state.artistName.length > 25 ? state.artistName.substring(0,22) + '...' : state.artistName) : "Aimee Mann"}
                </h2>
                <p style={{ zIndex: 999 }}>
                  {state.venue ? state.venue : "Tin Pan"}
                </p>
              </>
            )}
          </div>
          <div className="concertDetails">
            <p>{state.date ? state.date : "1/30/18"}</p>
            {/* <p style={{ zIndex: 999 }}>{state.comments}</p> */}
          </div>
        </div>
        {/* <div>
          test
        </div> */}
        <ReactPlayer
          ref={playerRef}
          width="100%"
          // Mobile hides the native controls in favor of PlayerControls below
          height={isMobile ? 0 : 28}
          // ReactPlayer only recognizes some extensions as audio (not .flac) and renders
          // a <video> for the rest, whose controls iOS hides once playback starts
          config={{ file: { forceAudio: true } }}
          style={{ maxWidth: 640 }}
          url={audioSrc}
          controls={!isMobile}
          id="audio"
          playing={state.playing}
          progressInterval={250}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onProgress={({ playedSeconds }) =>
            setProgress((prev) => ({ ...prev, played: playedSeconds }))
          }
          onDuration={(duration) => setProgress((prev) => ({ ...prev, duration }))}
        ></ReactPlayer>
        {isMobile && (
          <PlayerControls
            isPlaying={isPlaying}
            played={progress.played}
            duration={progress.duration}
            audioSrc={audioSrc}
            onTogglePlay={togglePlay}
            onSeek={seekTo}
          />
        )}
      </div>
      {/* <button className="button-48" role="button"><span className="text">Contact</span></button> */}
      
    </div>
  );
};

export default NowPlaying;
