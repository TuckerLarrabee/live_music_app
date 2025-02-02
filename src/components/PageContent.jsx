import BandsColumn from "./BandsColumn";
import RecordingDetailsColumn from "./RecordingDetailsColumn";
import ShowsColumn from "./ShowsColumn";
import YearsColumn from "./YearsColumn";
import NowPlaying from "./NowPlaying";
import "../styles/PageContent.css";
import { callGoogleSheets } from "../assets/sheet";
import { useEffect, useState } from "react";

const PageContent = () => {
  let allArtistNamesArr = [];
  const [state, setState] = useState({
    sheetData: [],
    artistNamesArray: [],
    specificArtistRecordingArray: [],
    showsColumnData: [],
    recordingDetailsColumnData: [],
    yearShowRecordingCounts: [],
    nowPlayingBannerData: [],
    inputFocused: null,
    audioSrc: "https://filedn.com/lOuia4am7mYbBSKrGDAEztL/aimee%20mann/01%20Aimee%20Mann%20-%20Intro%20-%202018-Jan-30%20-%20Tin%20Pan%20-%20RichmondVA.wav",
  });

  useEffect(() => {
    const fetchData = async () => {
      let response = await callGoogleSheets();

      setState((prevState) => ({
        ...prevState,
        sheetData: response,
      }));
    };
    fetchData();
    
  }, []);

  

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

  useEffect(() => {
    if (
      state.yearShowRecordingCounts.length > 1 &&
      state.showsColumnData.length
    ) {
      setState((prevState) => ({
        ...prevState,
        showsColumnData: [],
      }));
    }
  }, [state.yearShowRecordingCounts]);

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

  const setBandsSearched = (searchedItems) => {
    setState((prevState) => ({
      ...prevState,
      artistNamesArray: searchedItems,
    }));
  };
  const setFeaturedDisplay = (bool) => {
    setState((prevState) => ({
      ...prevState,
      inputFocused: bool,
    }));
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
    <>
      <NowPlaying
        recordingDetailsColumnData={state.recordingDetailsColumnData}
        nowPlayingBannerData={state.nowPlayingBannerData}
        audioSrc={state.audioSrc}
      ></NowPlaying>
      <section id="content">
        <div id="dataContainer">
          <BandsColumn
            setFeaturedDisplay={setFeaturedDisplay}
            bandNames={state.artistNamesArray}
            sheetData={state.sheetData}
            setSpecificArtistRecordingsArray={setSpecificArtistRecordingsArray}
            setShowsColumnData={setShowsColumnData}
            setYearShowRecordingCounts={setYearShowRecordingCounts}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
            setBandsSearched={setBandsSearched}
            nowPlayingBannerData={state.nowPlayingBannerData}
            inputFocused={state.inputFocused}
          ></BandsColumn>
          {/* <SwapIcon></SwapIcon> */}
          <YearsColumn
            specificArtistRecordings={state.specificArtistRecordingArray}
            setShowsColumnData={setShowsColumnData}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
            sheetData={state.sheetData}
            yearShowRecordingCounts={state.yearShowRecordingCounts}
          ></YearsColumn>
          <ShowsColumn
            showsColumnData={state.showsColumnData}
            specificArtistRecordings={state.specificArtistRecordingArray}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
          ></ShowsColumn>
          <RecordingDetailsColumn
            specificArtistRecordings={state.specificArtistRecordingArray}
            showsColumnData={state.showsColumnData}
            recordingDetailsColumnData={state.recordingDetailsColumnData}
            setNowPlayingBannerData={setNowPlayingBannerData}
            setAudioSrc={setAudioSrc}
          ></RecordingDetailsColumn>
        </div>
      </section>
    </>
  );
};

export default PageContent;
