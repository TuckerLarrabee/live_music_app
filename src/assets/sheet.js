const sheetID = "1rxeMzZZSR52KtG7Tm7v1e6sWoF4c_yo9PxUXGMfN0us";
const baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = "Sheet1";
const qu = "Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O";
const query = encodeURIComponent(qu);
const url = `${baseURL}&sheet=${sheetName}&tq=${query}`;

let artistDataArr = [];

const callGoogleSheets = async () => {
  try {
    // const fetch = await import("node-fetch");
    const sheetData = await fetch(url);

    if (!sheetData.ok) {
      throw new Error(`HTTP error! Status: ${sheetData.status}`);
    }

    let sheetDataText = await sheetData.text();

    const sheetDataJsObj = sheetDataText.substr(47).slice(0, -2);
    const sheetDataJSONObj = JSON.parse(sheetDataJsObj.replace(/\\/g, ""));
    
    artistDataArr.length= 0;
    sheetDataJSONObj.table.rows.forEach((data) => {
      convertNullToEmptyString(data.c);
      

      artistDataArr.push({
        Date: data.c[0].f,
        Band: data.c[1].v,
        Venue: data.c[2].v,
        City: data.c[3].v,
        State: data.c[4].v,
        RecordingFormat: data.c[5].v,
        Generation: data.c[6].v,
        RecordingDeck: data.c[7].v,
        Mic: data.c[8].v,
        RecordingTime: data.c[9].v,
        AudioLink: data.c[10].v,
        Comments: data.c[11].v,
        setlistFMlink: data.c[12].v,
        image1: data.c[13].v,
        image2: data.c[14].v,
      });
    });

    return artistDataArr;
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
  }
};

function convertNullToEmptyString(obj) {
  for (const key in obj) {
    if (obj[key] === null) {
      obj[key] = "";
    } else if (obj[key].v === null) {
      obj[key] = "";
    }
  }
}

export {callGoogleSheets}