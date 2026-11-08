import { useEffect, useState, setState, useRef } from "react";
import "../styles/BandsColumn.css";
import "../styles/Search.css";
import { getYearData } from "../utils.js";
import SearchInput from "./Search";
import AlphabetIndex from "./AlphabetIndex";
import {divStyle, testDivStyle, divPassiveStyle, testDivPassiveStyle} from '../styles/commonStyles'

const BandsColumn = ({
  bandNames,
  sheetData,
  setSpecificArtistRecordingsArray,
  setShowsColumnData,
  setYearShowRecordingCounts,
  setRecordingDetailsColumnData,
  nowPlayingBannerData,
  setSearchActive,
  searchActive,
  showMobileView,
  linkedSelection
}) => {
  const [highlightedBand, setHighlightedBand] = useState(null);
  const [testState, setTestState] = useState(null);
  const [randomArtistArr, setRandomArtistArr] = useState([]);
  const [recentlyFeaturedArtistArr, setRecentlyFeaturedArtistArr] = useState([]);

  const currentClick = useRef(null)
  const nowPlayingDiv = useRef(null)
  const [searchedArtists, setSearchedArtists] = useState([]);

  useEffect(() => {
    setSearchedArtists(bandNames);
  }, [bandNames]);

   
  
  let getRecent = () => {
    // A Set keeps each band once (in first-marked order), since several rows
    // for the same band are often marked. Also accepts "X" or stray spaces.
    let recentArtistSet = new Set()
    sheetData.forEach((artist)=> {
      if (String(artist.RecentlyFeatured).trim().toLowerCase() == "x") {
        recentArtistSet.add(artist.Band)
      }
    })

    setRecentlyFeaturedArtistArr(Array.from(recentArtistSet))
    }
    
    useEffect(() => {

      getRecent()
    },[sheetData])

  useEffect(() => {
    // console.log(randomArtist)
    nowPlayingDiv.current = currentClick.current
    setTestState(nowPlayingDiv.current)
  }, [nowPlayingBannerData]);

  // Highlight and scroll to the band opened from a shared link
  useEffect(() => {
    if (!linkedSelection) return;
    const band = linkedSelection.band;
    setHighlightedBand(band);
    currentClick.current = band;
    if (linkedSelection.source) {
      nowPlayingDiv.current = band;
    }
    const bandRow = [...document.querySelectorAll("#bandUl .bandParentDiv")]
      .reverse()
      .find((row) => row.id === band);
    // Scroll only the band list (scrollIntoView would also scroll the page)
    if (bandRow) {
      const bandList = document.getElementById("bandUl");
      const rowTop = bandRow.getBoundingClientRect().top;
      const listTop = bandList.getBoundingClientRect().top;
      bandList.scrollTop += rowTop - listTop - bandList.clientHeight / 2;
    }
  }, [linkedSelection]);
  
  const filterBands = (searchedItems) => {
    setSearchedArtists(searchedItems);
  };
  
  const getSpecificArtist = (event) => {
    let bandLiIndex = event.target.id;
    setHighlightedBand(bandLiIndex);
    
    
    // console.log("EVENT TARGET", event.target.id)
    currentClick.current = bandLiIndex

    if (nowPlayingDiv.current != bandLiIndex && nowPlayingBannerData) {
      setTestState(divStyle)
    }
    
    let clickedArtist = event.target.textContent;
    let specificArtistArray = [];
    sheetData.forEach((artist) => {
      if (clickedArtist === artist.Band) {
        specificArtistArray.push(artist);
      }
    });
    // console.log("🚀 ~ sheetData.forEach ~ specificArtistArray:", specificArtistArray)
    getSpecificArtistYears(specificArtistArray);
  };

  const getSpecificArtistYears = (specificArtistArray) => {
    let yearDataArr = getYearData(specificArtistArray);

    if (yearDataArr.length === 1 && yearDataArr[0].showCount === 1) {
      setYearShowRecordingCounts(yearDataArr);
      setSpecificArtistRecordingsArray(specificArtistArray);
      setRecordingDetailsColumnData(specificArtistArray);
      showMobileView("details");
    } else {
      setYearShowRecordingCounts(yearDataArr);
      setSpecificArtistRecordingsArray(specificArtistArray);
      setRecordingDetailsColumnData([]);
      if (yearDataArr.length > 1) {
        setShowsColumnData([]);
      }
      // A single year auto-fills the Shows column, so skip straight to it
      showMobileView(yearDataArr.length === 1 ? "shows" : "years");
    }
  };

  return (
    <aside id="bandContainer">
      <div id="headerDiv">
        <SearchInput
          setSearchActive={setSearchActive}
          bandNames={bandNames}
          filterBands={filterBands}
        ></SearchInput>
        <h1 id="bandHeaderText"> Bands:</h1>
      </div>
      <ul id="bandUl">
        {!searchActive && <div id="featured">Recently Featured</div>}
        {!searchActive && recentlyFeaturedArtistArr.map((name, index) => (
          <div key={index}>
            <div
              key={index}
              onClick={getSpecificArtist}
              id={name}
              className="bandParentDiv"
              >
              <div
                className="bandLiDiv"
                style={highlightedBand == name ? divStyle : (nowPlayingDiv.current == name ? divPassiveStyle : testDivStyle) }
                ></div>
              <li className="bandLi" key={index}>
                <a id={name}>{name}</a>
              </li>
            </div>
          </div>
        ))}
        {/* {searchedArtists.slice(15,17).map((name, index) => (
          <div
            key={index}
            onClick={getSpecificArtist}
            id={name}
            className="bandParentDiv"
          >
            <div
              className="bandLiDiv"
              style={highlightedBand == name ? divStyle : (nowPlayingDiv.current == name ? divPassiveStyle : testDivStyle) }
            ></div>
            <li className="bandLi" key={index}>
              <a id={name}>{name}</a>
            </li>
          </div>
        ))} */}
        <div id="bands">Bands</div>
        {searchedArtists.map((name, index) => (
          <div
            key={index}
            onClick={getSpecificArtist}
            id={name}
            className="bandParentDiv"
          >
            <div
              className="bandLiDiv"
              style={highlightedBand == name ? divStyle : (nowPlayingDiv.current == name ? divPassiveStyle : testDivStyle) }
            ></div>
            <li className="bandLi" key={index}>
              <a id={name}>{name}</a>
            </li>
          </div>
        ))}
      </ul>
      {!searchActive && <AlphabetIndex bandNames={searchedArtists}></AlphabetIndex>}
    </aside>
  );
};

export default BandsColumn;
