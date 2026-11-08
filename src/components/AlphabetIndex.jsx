import { useRef, useState } from "react";
import "../styles/AlphabetIndex.css";

// Names starting with a number sort first, so "#" leads the index
const LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const getLetter = (name) => {
  const first = name.normalize("NFD")[0]?.toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
};

// iPhone Contacts-style A–Z strip: tap or drag along it to jump through the band list
const AlphabetIndex = ({ bandNames }) => {
  const stripRef = useRef(null);
  const isDragging = useRef(false);
  const currentLetter = useRef(null);
  // Enlarged letter shown beside the strip while the user is touching it
  const [bubble, setBubble] = useState(null);

  const jumpToLetter = (letter) => {
    const firstIndexByLetter = {};
    bandNames.forEach((name, index) => {
      const nameLetter = getLetter(name);
      if (firstIndexByLetter[nameLetter] === undefined) {
        firstIndexByLetter[nameLetter] = index;
      }
    });

    // Letters with no bands (e.g. Q) jump to the next letter that has some
    const targetLetter = LETTERS.slice(LETTERS.indexOf(letter)).find(
      (candidate) => firstIndexByLetter[candidate] !== undefined
    );
    const bandList = document.getElementById("bandUl");
    const bandRows = bandList.querySelectorAll("#bands ~ .bandParentDiv");
    const targetRow = bandRows[firstIndexByLetter[targetLetter]];
    if (!targetRow) {
      bandList.scrollTop = bandList.scrollHeight;
      return;
    }
    bandList.scrollTop +=
      targetRow.getBoundingClientRect().top - bandList.getBoundingClientRect().top;
  };

  // Uses the finger's height along the strip (not the element under it), so
  // drifting sideways off the narrow strip while dragging keeps working
  const handlePointer = (event) => {
    const rect = stripRef.current.getBoundingClientRect();
    const position = (event.clientY - rect.top) / rect.height;
    const index = Math.min(
      LETTERS.length - 1,
      Math.max(0, Math.floor(position * LETTERS.length))
    );
    const letter = LETTERS[index];
    if (letter !== currentLetter.current) {
      currentLetter.current = letter;
      jumpToLetter(letter);
      // Line the bubble up with the letter, measured from the top of the index area
      const indexTop = stripRef.current.parentElement.getBoundingClientRect().top;
      const letterCenter = rect.top + ((index + 0.5) * rect.height) / LETTERS.length;
      setBubble({ letter, top: letterCenter - indexTop });
    }
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    isDragging.current = true;
    handlePointer(event);
  };

  const handlePointerMove = (event) => {
    if (isDragging.current) handlePointer(event);
  };

  const handlePointerEnd = () => {
    isDragging.current = false;
    currentLetter.current = null;
    setBubble(null);
  };

  return (
    <div
      className="alphabetIndex"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      aria-hidden="true"
    >
      <div className="alphabetIndexLetters" ref={stripRef}>
        {LETTERS.map((letter) => (
          <span key={letter} className={bubble?.letter === letter ? "isActive" : undefined}>
            {letter}
          </span>
        ))}
      </div>
      {bubble && (
        <div className="alphabetIndexBubble" style={{ top: bubble.top }}>
          {bubble.letter}
        </div>
      )}
    </div>
  );
};

export default AlphabetIndex;
