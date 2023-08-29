import BandsColumn from "./BandsColumn";
import RecordingDetailsColumn from "./RecordingDetailsColumn";
import ShowsColumn from "./ShowsColumn";
import YearsColumn from "./YearsColumn";
import NowPlaying from "./NowPlaying";
import "../styles/PageContent.css";
import { callGoogleSheets } from "../assets/sheet";
import { useEffect, useState, useRef } from "react";

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

  return (
    <>
      <NowPlaying
        recordingDetailsColumnData={state.recordingDetailsColumnData}
        nowPlayingBannerData={state.nowPlayingBannerData}
      ></NowPlaying>
      <section id="content">
        <div id="dataContainer">
          <BandsColumn
            bandNames={state.artistNamesArray}
            sheetData={state.sheetData}
            setSpecificArtistRecordingsArray={setSpecificArtistRecordingsArray}
            setShowsColumnData={setShowsColumnData}
            setYearShowRecordingCounts={setYearShowRecordingCounts}
            setRecordingDetailsColumnData={setRecordingDetailsColumnData}
          ></BandsColumn>
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
          ></RecordingDetailsColumn>
        </div>
      </section>
    </>
  );
};

export default PageContent;
