const sheetID = "1glxDTAV-2MmsRYiHDGNqihOZeSFOXIDUHhyTP8UDLe0";
const baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = "Sheet1";
const qu = "Select A";
const query = encodeURIComponent(qu);
const url = `${baseURL}&sheet=${sheetName}&tq=${query}`;

let audioFileArray = [];

const getAudioFiles = async () => {
  try {
    const sheetData = await fetch(url);

    if (!sheetData.ok) {
      throw new Error(`HTTP error! Status: ${sheetData.status}`);
    }

    let sheetDataText = await sheetData.text();

    const sheetDataJsObj = sheetDataText.substr(47).slice(0, -2);
    const sheetDataJSONObj = JSON.parse(sheetDataJsObj.replace(/\\/g, ""));
    console.log("🚀 ~ file: sheetAutomation.js:22 ~ getAudioFiles ~ sheetDataJSONObj:", sheetDataJSONObj)

    // audioFileArray.length = 0;
    sheetDataJSONObj.table.rows.forEach((data) => {
        // console.log("🚀 ~ file: sheetAutomation.js:25 ~ sheetDataJSONObj.table.rows.forEach ~ data:", data.c[0]['v'])
        audioFileArray.push(data.c[0]['v']);
    });

    const audioFileSet = new Set(audioFileArray)
    const uniqueAudioArray = Array.from(audioFileSet)
    // console.log("🚀 ~ file: sheetAutomation.js:31 ~ getAudioFiles ~ uniqueAudioArray:", uniqueAudioArray)

    uniqueAudioArray.forEach(file => {
        let spreadSheetInfo = (file.split('/')[5].slice(0, -4).split('_'))
        console.log("🚀 ~ file: sheetAutomation.js:35 ~ getAudioFiles ~ spreadSheetInfo:", spreadSheetInfo.join(',').replace(/%20/g, ' '))
        
      
        // console.log(underscoreSeparator.replace(/%20/g, " "))
        
    })
    console.log('--------------------')
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
  }
};

// function convertNullToEmptyString(obj) {
//   for (const key in obj) {
//     if (obj[key] === null) {
//       obj[key] = "";
//     } else if (obj[key].v === null) {
//       obj[key] = "";
//     }
//   }
// }

export { getAudioFiles };
