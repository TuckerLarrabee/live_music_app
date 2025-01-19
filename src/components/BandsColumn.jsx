import { useEffect, useState, setState, useRef } from "react";
import "../styles/BandsColumn.css";
import "../styles/Search.css";
import { countShows, countUniqueShowsByYear } from "../utils.js";
import SearchInput from "./Search";
import {divStyle, testDivStyle, divPassiveStyle, testDivPassiveStyle} from '../styles/commonStyles'

const BandsColumn = ({
  bandNames,
  sheetData,
  setSpecificArtistRecordingsArray,
  setYearShowRecordingCounts,
  setRecordingDetailsColumnData,
  setBandsSearched,
  nowPlayingBannerData,
  setFeaturedDisplay,
  inputFocused
}) => {
  const [highlightedBand, setHighlightedBand] = useState(null);
  const [testState, setTestState] = useState(null);
  const [randomArtistArr, setRandomArtistArr] = useState([]);
  const currentClick = useRef(null)
  const nowPlayingDiv = useRef(null)
  const [searchedArtists, setSearchedArtists] = useState([]);
  const [filteredSheetData, setFilteredSheetData] = useState(sheetData)

  useEffect(() => {
    setSearchedArtists(bandNames);
  }, [bandNames]);

   
  
  let getRandom = () => {
    let randArtistArr = []
    let randomIndex = Math.floor(Math.random() * sheetData.length)
    let randArtist = sheetData[randomIndex]
    let randomIndexTwo = Math.floor(Math.random() * sheetData.length)
    let randArtistTwo = sheetData[randomIndexTwo]
    if (randArtist && randArtistTwo) {
      randArtistArr.push(randArtist.Band, randArtistTwo.Band)
      filteredSheetData.splice(randomIndex, randomIndex +1)
      filteredSheetData.splice(randomIndexTwo, randomIndexTwo +1)
    }
    setRandomArtistArr(randArtistArr)
    setFilteredSheetData(filteredSheetData)
    }
    
    useEffect(() => {

      getRandom()
    },[sheetData])

  useEffect(() => {
    // console.log(randomArtist)
    nowPlayingDiv.current = currentClick.current
    setTestState(nowPlayingDiv.current)
  }, [nowPlayingBannerData]);
  
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
    // console.log("🚀 ~ getSpecificArtistYears ~ specificArtistArray:", specificArtistArray)
    let currentYear = new Date().getFullYear().toString().slice(-2);

    let showCountArr = [];
    specificArtistArray.forEach((show) => {
      showCountArr.push(show.Date);
    });

    let yearCountArr = [];
    showCountArr.forEach((show) => {
      yearCountArr.push(show.slice(-2));
    });
    let yearCountSet = new Set(yearCountArr);
    // console.log("🚀 ~ getSpecificArtistYears ~ yearCountSet:", yearCountSet)

    let yearRecordingCount = countShows(yearCountArr);
    // console.log("🚀 ~ getSpecificArtistYears ~ yearRecordingCount:", yearRecordingCount)
    let yearDataArr = [];
    let uniqueShows = countUniqueShowsByYear(showCountArr);
    // console.log("🚀 ~ getSpecificArtistYears ~ uniqueShows:", uniqueShows)
    
    
    for (let [key, value] of Object.entries(yearRecordingCount)) {
      for (let yearKey in uniqueShows) {
        if (yearKey == key) {
          if (key <= currentYear) {
            key = "20" + key;
          } else if (key > currentYear) {
            key = "19" + key;
          }
          const yearObj = {
            year: key,
            recordingCount: value,
            showCount: uniqueShows[yearKey],
          };
          
          yearDataArr.push(yearObj);
        }
      }
    }
    let previousCenturyArr = []
    let currentCenturyArr= []
    
    yearDataArr.forEach(item => {
      if (item.year < 2000) {
        previousCenturyArr.push(item)
      }
      else {
        currentCenturyArr.push(item)
      }
    })
    console.log("🚀 ~ getSpecificArtistYears ~ previousCenturyArr:", previousCenturyArr)
    console.log("🚀 ~ getSpecificArtistYears ~ currentCenturyArr:", currentCenturyArr)
    yearDataArr = previousCenturyArr.concat(currentCenturyArr)
    yearDataArr.sort((a, b) => new Date(b.year) - new Date(a.year));
    console.log("🚀 ~ YOOO ~ yearDataArr:", yearDataArr)
    
    
    if (yearCountSet.size === 1 && yearDataArr[0].showCount === 1) {
      setYearShowRecordingCounts(yearDataArr);
      setSpecificArtistRecordingsArray(specificArtistArray);
      setRecordingDetailsColumnData(specificArtistArray);
    } else {
      setYearShowRecordingCounts(yearDataArr);
      setSpecificArtistRecordingsArray(specificArtistArray);
      setRecordingDetailsColumnData([]);
    }
  };

  return (
    <aside id="bandContainer">
      <div id="headerDiv">
        <SearchInput
          setFeaturedDisplay={setFeaturedDisplay}
          bandNames={bandNames}
          setBandsSearched={setBandsSearched}
          filterBands={filterBands}
        ></SearchInput>
        <h1 id="bandHeaderText"> Bands:</h1>
      </div>
      <ul id="bandUl">
        <div id="featured">Featured</div>
        {inputFocused != true && randomArtistArr.map((name, index) => (
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
    </aside>
  );
};

export default BandsColumn;
