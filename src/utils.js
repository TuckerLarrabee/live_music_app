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
  
    for (const date of dates) {
      // Split the date string to extract the year
      const parts = date.split('/');
      if (parts.length === 3) {
        const year = parts[2];
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
    }
  
    return uniqueDatesByYear;
  }

export { countShows, countUniqueShowsByYear };
