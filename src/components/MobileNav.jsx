import ScrollingText from "./ScrollingText";
import "../styles/MobileNav.css";

const MobileNav = ({ mobileView, bandName, recording, goToMobileHome }) => {
  if (mobileView === "bands") return null;

  // On the details view, show which show the recordings belong to
  const subtitle =
    mobileView === "details" && recording
      ? `${recording.Date} · ${recording.Venue}`
      : null;

  return (
    <nav id="mobileNav">
      <button
        id="mobileBackBtn"
        aria-label="Back"
        onClick={() => window.history.back()}
      >
        ‹
      </button>
      <div id="mobileNavTitle">
        <ScrollingText as="h2" text={bandName} />
        {subtitle && <ScrollingText as="p" text={subtitle} />}
      </div>
      <button
        id="mobileHomeBtn"
        aria-label="Back to all bands"
        onClick={goToMobileHome}
      >
        <img src={`${import.meta.env.BASE_URL}pyramid10.png`} alt="" />
      </button>
    </nav>
  );
};

export default MobileNav;
