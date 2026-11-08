const countShows = (arr) => {
  // Create an object to store element frequencies
  const frequencyObject = {};

  // Iterate through the array
  for (const element of arr) {
    if (frequencyObject[element]) {
      frequencyObject[element] += 1;
    } else {
      frequencyObject[element] = 1;
    }
  }

  // Create an object to store duplicate counts
  const showCount = {};

  // Iterate through the frequencyObject to find duplicates
  for (const [element, count] of Object.entries(frequencyObject)) {
    // if (count > 1) {
    showCount[element] = count;
    // }
  }

  return showCount;
};

function countUniqueShowsByYear(dates) {
    const uniqueDatesByYear = {};
    console.log("🚀 ~ countUniqueShowsByYear ~ uniqueDatesByYear:", uniqueDatesByYear)
  
    for (const date of dates) {
      // Split the date string to extract the year
      const parts = date.split('/');
      if (parts.length === 3) {
        const year = parts[2];
        console.log("🚀 ~ countUniqueShowsByYear ~ year:", year)
        // Initialize an empty set for each year if it doesn't exist
        if (!uniqueDatesByYear[year]) {
          uniqueDatesByYear[year] = new Set();
        }
        // Add the date to the set for the year
        uniqueDatesByYear[year].add(date);
      }
    }
  
    // Convert sets to counts
    for (const year in uniqueDatesByYear) {
      uniqueDatesByYear[year] = uniqueDatesByYear[year].size;
      console.log("🚀 ~ countUniqueShowsByYear ~ uniqueDatesByYear:", uniqueDatesByYear)
    }
  
    return uniqueDatesByYear;
  }

// Builds the Years column data for one artist's recordings
const getYearData = (specificArtistArray) => {
  let currentYear = new Date().getFullYear().toString().slice(-2);

  let showCountArr = [];
  specificArtistArray.forEach((show) => {
    showCountArr.push(show.Date);
  });

  let yearCountArr = [];
  showCountArr.forEach((show) => {
    yearCountArr.push(show.slice(-2));
  });

  let yearRecordingCount = countShows(yearCountArr);
  let yearDataArr = [];
  let uniqueShows = countUniqueShowsByYear(showCountArr);

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
  let previousCenturyArr = [];
  let currentCenturyArr = [];

  yearDataArr.forEach((item) => {
    if (item.year < 2000) {
      previousCenturyArr.push(item);
    } else {
      currentCenturyArr.push(item);
    }
  });
  yearDataArr = previousCenturyArr.concat(currentCenturyArr);
  yearDataArr.sort((a, b) => new Date(b.year) - new Date(a.year));

  return yearDataArr;
};

function sortShowsDescending(uniqueShowListArr) {
  return uniqueShowListArr.sort((a, b) => {
    const aParts = a.date.split("/");
    const bParts = b.date.split("/");

    const aYear = aParts[2].length === 2 ? 2000 + +aParts[2] : +aParts[2];
    const bYear = bParts[2].length === 2 ? 2000 + +bParts[2] : +bParts[2];

    const aKey = aYear * 10000 + +aParts[0] * 100 + +aParts[1];
    const bKey = bYear * 10000 + +bParts[0] * 100 + +bParts[1];

    return bKey - aKey; // Descending (newest first)
  });
}

// Builds the Shows column data: one entry per unique date, newest first
const buildShowList = (recordings) => {
  const showsByDate = new Map();
  recordings.forEach((recording) => {
    const show = showsByDate.get(recording.Date) ?? {
      date: recording.Date,
      recordingCount: 0,
    };
    show.venue = recording.Venue;
    show.city = recording.City;
    show.state = recording.State;
    show.recordingCount += 1;
    showsByDate.set(recording.Date, show);
  });
  return sortShowsDescending(Array.from(showsByDate.values()));
};

// Shareable link for a band, optionally narrowed to a show date and source number.
// Dates use dashes in the URL (3-3-05) so they don't need escaping.
const buildShareUrl = ({ band, date, source } = {}) => {
  const params = new URLSearchParams();
  if (band) params.set("band", band);
  if (band && date) params.set("date", date.replaceAll("/", "-"));
  if (band && date && source) params.set("source", source);
  const query = params.toString();
  return (
    window.location.origin + window.location.pathname + (query ? `?${query}` : "")
  );
};

export {
  countShows,
  countUniqueShowsByYear,
  getYearData,
  buildShowList,
  buildShareUrl,
};
