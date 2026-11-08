import { useLayoutEffect, useRef, useState } from "react";
import "../styles/ScrollingText.css";

// Single line of text that, when too long to fit, slides over to reveal the
// cut-off end and back again (falls back to an ellipsis for reduced motion)
const ScrollingText = ({ as: Tag, text, className }) => {
  const containerRef = useRef(null);
  const [overflow, setOverflow] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const hidden = container.scrollWidth - container.clientWidth;
      setOverflow(hidden > 1 ? Math.ceil(hidden) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  const classes = ["scrollingText", overflow && "isOverflowing", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={containerRef}
      className={classes}
      style={
        overflow
          ? {
              "--scroll-distance": `-${overflow}px`,
              // Longer overflow scrolls for longer, so the speed stays readable
              "--scroll-duration": `${6 + overflow / 25}s`,
            }
          : undefined
      }
    >
      <span>{text}</span>
    </Tag>
  );
};

export default ScrollingText;
