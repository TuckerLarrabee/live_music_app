import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRotateLeft,
  faRotateRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/PlayerControls.css";

const formatTime = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};

// Custom mobile player controls. iOS ignores CSS on the native <audio> controls,
// so on phones we draw our own to match the Now Playing bar.
const PlayerControls = ({ isPlaying, played, duration, audioSrc, onTogglePlay, onSeek }) => {
  // Position while the user is dragging the scrubber, so playback updates don't fight the drag
  const [scrubValue, setScrubValue] = useState(null);
  const position = scrubValue ?? played;
  const percent = duration ? Math.min(100, (position / duration) * 100) : 0;

  const commitScrub = () => {
    if (scrubValue === null) return;
    onSeek(scrubValue);
    setScrubValue(null);
  };

  const skip = (seconds) => {
    onSeek(Math.min(Math.max(0, played + seconds), duration || 0));
  };

  return (
    <div className="playerControls">
      <button className="playerBtn" onClick={() => skip(-15)} aria-label="Back 15 seconds">
        <FontAwesomeIcon icon={faRotateLeft} />
        <span className="skipLabel">15</span>
      </button>
      <button
        className="playerBtn playPauseBtn"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>
      <button className="playerBtn" onClick={() => skip(15)} aria-label="Forward 15 seconds">
        <FontAwesomeIcon icon={faRotateRight} />
        <span className="skipLabel">15</span>
      </button>

      <span className="playerTime">{formatTime(position)}</span>
      <input
        className="playerScrubber"
        type="range"
        min={0}
        max={duration || 0}
        step="any"
        value={position}
        style={{ "--progress": `${percent}%` }}
        onChange={(event) => setScrubValue(Number(event.target.value))}
        onPointerUp={commitScrub}
        onTouchEnd={commitScrub}
        onKeyUp={commitScrub}
        aria-label="Seek"
      />
      <span className="playerTime">-{formatTime(duration - position)}</span>

      {/* Cross-origin files can't be force-downloaded, so this opens the file;
          on iPhone it can then be saved via the share sheet */}
      <a
        className="playerBtn"
        href={audioSrc}
        target="_blank"
        rel="noopener noreferrer"
        download
        aria-label="Download recording"
      >
        <FontAwesomeIcon icon={faDownload} />
      </a>
    </div>
  );
};

export default PlayerControls;
