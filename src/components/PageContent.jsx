import BandsColumn from "./BandsColumn";
import RecordingDetailsColumn from "./RecordingDetailsColumn";
import ShowsColumn from "./ShowsColumn";
import YearsColumn from "./YearsColumn";
import NowPlaying from "./NowPlaying";
import MobileNav from "./MobileNav";
import "../styles/PageContent.css";
import "../styles/Mobile.css";
import { callGoogleSheets } from "../assets/sheet";
import { useEffect, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { getYearData, buildShowList, buildShareUrl } from "../utils.js";

// Turns ?band=…&date=…&source=… into the same column state a user would
// get by clicking through. Returns null if the band isn't in the sheet.
const readSharedLink = (sheetData) => {
  const params = new URLSearchParams(window.location.search);
  // Trimmed to match the trimmed band names (older links may have trailing spaces)
  const band = params.get("band")?.trim();
  const artistRecordings = sheetData.filter((recording) => recording.Band === band);
  if (!artistRecordings.length) return null;

  const yearData = getYearData(artistRecordings);
  const date = params.get("date")?.replaceAll("-", "/");
  const showRecordings = artistRecordings.filter((recording) => recording.Date === date);
  const source = Number(params.get("source"));
  const playingRecording = showRecordings[source - 1];

  // Without a valid date, fall back to what clicking the band would show
  let yearKey = null;
  if (showRecordings.length) {
    yearKey = date.slice(-2);
  } else if (yearData.length === 1) {
    yearKey = yearData[0].year.slice(-2);
  }
  const yearRecordings = yearKey
    ? artistRecordings.filter((recording) => recording.Date.slice(-2) === yearKey)
    : [];
  const showsInYear = buildShowList(yearRecordings);
  let detailRecordings = [];
  if (showRecordings.length) {
    detailRecordings = showRecordings;
  } else if (showsInYear.length === 1) {
    detailRecordings = yearRecordings;
  }

  // Mobile screens to stack up, skipping levels with only one option
  const mobilePath = [];
  if (yearData.length > 1) mobilePath.push("years");
  if (showsInYear.length > 1) mobilePath.push("shows");
  if (detailRecordings.length) mobilePath.push("details");

  return {
    columns: {
      specificArtistRecordingArray: artistRecordings,
      yearShowRecordingCounts: yearData,
      showsColumnData: showsInYear,
      recordingDetailsColumnData: detailRecordings,
      // Load the shared recording into the player; browsers require a tap to start it
      ...(playingRecording && {
        nowPlayingBannerData: playingRecording,
        audioSrc: playingRecording.AudioLink,
      }),
    },
    linkedSelection: {
      band,
      year: yearData.find((yearObj) => yearObj.year.slice(-2) === yearKey)?.year,
      date: detailRecordings[0]?.Date,
      source: playingRecording ? source : null,
    },
    mobilePath,
  };
};

const PageContent = () => {
  const isMobile = useIsMobile();
  // Which column is visible on mobile: "bands" | "years" | "shows" | "details"
  const [mobileView, setMobileView] = useState("bands");
  const [mobileNavDirection, setMobileNavDirection] = useState("forward");
  // Selection opened from a shared link, used by the columns to set their highlights
  const [linkedSelection, setLinkedSelection] = useState(null);

  let allArtistNamesArr = [];
  const [state, setState] = useState({
    sheetData: [],
    artistNamesArray: [],
    specificArtistRecordingArray: [],
    showsColumnData: [],
    recordingDetailsColumnData: [],
    yearShowRecordingCounts: [],
    nowPlayingBannerData: [],
    searchActive: null,
    audioSrc: "https://filedn.com/lOuia4am7mYbBSKrGDAEztL/aimee%20mann/01%20Aimee%20Mann%20-%20Intro%20-%202018-Jan-30%20-%20Tin%20Pan%20-%20RichmondVA.wav",
  });

  useEffect(() => {
    // Ignore a stale response (React StrictMode runs this effect twice in dev),
    // otherwise a shared link would be applied twice and duplicate history entries
    let ignore = false;
    const fetchData = async () => {
      let response = await callGoogleSheets();
      if (ignore) return;
      const sharedLink = response ? readSharedLink(response) : null;

      setState((prevState) => ({
        ...prevState,
        sheetData: response,
        ...sharedLink?.columns,
      }));

      if (sharedLink) {
        setLinkedSelection(sharedLink.linkedSelection);
        if (isMobile) {
          openMobilePath(sharedLink);
        }
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  // Recreate the history a user would have from tapping through, so Back
  // from a shared link goes up one level instead of leaving the site
  const openMobilePath = ({ linkedSelection, mobilePath }) => {
    const { band, date, source } = linkedSelection;
    window.history.replaceState({ mobileView: "bands", depth: 0 }, "", buildShareUrl());
    mobilePath.forEach((view, index) => {
      const url =
        view === "details"
          ? buildShareUrl({ band, date, source })
          : buildShareUrl({ band });
      window.history.pushState({ mobileView: view, depth: index + 1 }, "", url);
    });
    setMobileNavDirection("forward");
    setMobileView(mobilePath[mobilePath.length - 1] ?? "bands");
  };

  // Keep the address bar pointing at the current selection so it can be copied/shared
  useEffect(() => {
    const band = state.specificArtistRecordingArray[0]?.Band;
    // Nothing selected yet; leave an incoming link's URL alone
    if (!band) return;
    const date = state.recordingDetailsColumnData[0]?.Date;
    const playingIndex = state.recordingDetailsColumnData.indexOf(
      state.nowPlayingBannerData
    );
    const source = playingIndex >= 0 ? playingIndex + 1 : null;
    window.history.replaceState(
      window.history.state,
      "",
      buildShareUrl({ band, date, source })
    );
  }, [
    state.specificArtistRecordingArray,
    state.recordingDetailsColumnData,
    state.nowPlayingBannerData,
  ]);

  useEffect(() => {
    const getAllBandNames = async () => {
      state.sheetData.forEach((artist) => {
        allArtistNamesArr.push(artist.Band);
      });

      let uniqueArtistNameSet = new Set(allArtistNamesArr);
      let uniqueArtistNameArr = Array.from(uniqueArtistNameSet);
      uniqueArtistNameArr.sort()
      setState((prevState) => ({
        ...prevState,
        artistNamesArray: uniqueArtistNameArr,
      }));
    };

    getAllBandNames();
  }, [state.sheetData]);

  const setSpecificArtistRecordingsArray = (artistRecordings) => {
    setState((prevState) => ({
      ...prevState,
      specificArtistRecordingArray: artistRecordings,
    }));
  };

  const setShowsColumnData = (shows) => {
    setState((prevState) => ({
      ...prevState,
      showsColumnData: shows,
    }));
  };

  const setYearShowRecordingCounts = (yearDataArr) => {
    setState((prevState) => ({
      ...prevState,
      yearShowRecordingCounts: yearDataArr,
    }));
  };

  const setRecordingDetailsColumnData = (recordingDetailsArr) => {
    setState((prevState) => ({
      ...prevState,
      recordingDetailsColumnData: recordingDetailsArr,
    }));
  };

  const setNowPlayingBannerData = (selectedRecording) => {
    setState((prevState) => ({
      ...prevState,
      nowPlayingBannerData: selectedRecording,
    }));
  };

  const setAudioSrc = (audio) => {
    setState((prevState) => ({
      ...prevState,
      audioSrc: audio,
    }));
  };

  const setSearchActive = (bool) => {
    setState((prevState) => ({
      ...prevState,
      searchActive: bool,
    }));
  };

  // Each mobile drill-down is a browser history entry, so the phone's
  // back gesture/button moves up one column instead of leaving the site
  useEffect(() => {
    const handlePopState = (event) => {
      setMobileNavDirection("back");
      setMobileView(event.state?.mobileView ?? "bands");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const showMobileView = (view) => {
    if (!isMobile || view === mobileView) return;
    // depth = how many drill-downs above the Bands entry, so home can jump straight back
    const depth = (window.history.state?.depth ?? 0) + 1;
    window.history.pushState({ mobileView: view, depth }, "");
    setMobileNavDirection("forward");
    setMobileView(view);
  };

  // Pyramid logo: return to Bands by rewinding history, so Back from Bands
  // doesn't jump back down into the show the user just left
  const goToMobileHome = () => {
    const depth = window.history.state?.depth;
    if (depth > 0) {
      window.history.go(-depth);
      return;
    }
    window.history.replaceState({ mobileView: "bands", depth: 0 }, "");
    setMobileNavDirection("back");
    setMobileView("bands");
  };

  /* OPTIMIZE / REDUCE REDUNDANCY 
  // 
  // const updateState = (key, value) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     [key]: value,
  //   }));
  // };
  
  // Usage examples:
  
  // updateState("specificArtistRecordingArray", artistRecordings);
  // updateState("showsColumnData", shows);
  // updateState("yearShowRecordingCounts", yearDataArr);
  // updateState("recordingDetailsColumnData", recordingDetailsArr);
  // updateState("nowPlayingBannerData", selectedRecording);
  // updateState("audioSrc", audio);
  // updateState("artistNamesArray", searchedItems);
  */

  return (
    <div
      id="appShell"
      className={isMobile ? "mobile" : undefined}
      data-view={mobileView}
      data-direction={mobileNavDirection}
    >
      <NowPlaying
        recordingDetailsColumnData={state.recordingDetailsColumnData}
        nowPlayingBannerData={state.nowPlayingBannerData}
        audioSrc={state.audioSrc}
        isMobile={isMobile}
      ></NowPlaying>
      <section id="content">
        {isMobile && (
          <MobileNav
            mobileView={mobileView}
            bandName={state.specificArtistRecordingArray[0]?.Band}
            recording={state.recordingDetailsColumnData[0]}
            goToMobileHome={goToMobileHome}
          ></MobileNav>
        )}
        <div id="dataContainer">
          <BandsColumn
            showMobileView={showMobileView}
            setSearchActive={setSearchActive}
            bandNames={state.artistNamesArray}
            sheetData={state.sheetData}
            setSpecificArtistRecordingsArray={setSpecificArtistRecordingsArray}
            setShowsColumnData={setShowsColumnData}
            setYearShowRecordingCounts={setYearShowRecordingCounts}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
            nowPlayingBannerData={state.nowPlayingBannerData}
            searchActive={state.searchActive}
            linkedSelection={linkedSelection}
          ></BandsColumn>
          <YearsColumn
            specificArtistRecordings={state.specificArtistRecordingArray}
            setShowsColumnData={setShowsColumnData}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
            sheetData={state.sheetData}
            yearShowRecordingCounts={state.yearShowRecordingCounts}
            linkedSelection={linkedSelection}
            showMobileView={showMobileView}
          ></YearsColumn>
          <ShowsColumn
            showMobileView={showMobileView}
            showsColumnData={state.showsColumnData}
            specificArtistRecordings={state.specificArtistRecordingArray}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
            linkedSelection={linkedSelection}
          ></ShowsColumn>
          <RecordingDetailsColumn
            specificArtistRecordings={state.specificArtistRecordingArray}
            showsColumnData={state.showsColumnData}
            recordingDetailsColumnData={state.recordingDetailsColumnData}
            setNowPlayingBannerData={setNowPlayingBannerData}
            setAudioSrc={setAudioSrc}
            linkedSelection={linkedSelection}
          ></RecordingDetailsColumn>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
