var intervalId;
var desktopUserAgent = navigator.userAgent;
var mobileUserAgent = "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
var userAgent = navigator.userAgent;
var result="";
var activeTabId = null;
var searchUrl;
var stopSearch = false;

function modeSearch(numSearchesD,numSearchesM, searchType, searchGen){
  if (searchType === "desktop") {
    desktopSearch(numSearchesD,numSearchesM,searchType,searchGen);
  } else if (searchType === "mobile") {
    mobileSearch(numSearchesD,numSearchesM,searchType,searchGen);
  }else if(searchType === "desktopmobile"){
    desktopMobileSearch(numSearchesD,numSearchesM,searchType,searchGen);
  }
   else {
    console.error("Invalid search type: " + searchType);
    return;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function desktopMobileSearch(numSearchesD, numSearchesM, searchType, searchGen) {
  if (searchType === "desktopmobile") {
    console.log("Executing Desktop and Mobile Search");

    await desktopSearch(numSearchesD,numSearchesM,"desktop" ,searchGen);
    console.log("Finished performing desktop search.");

    // await delay(numSearchesD * 1000);

    if (numSearchesM > 0) {
      await mobileSearch(numSearchesD,numSearchesM,"mobile", searchGen);
      console.log("Finished performing mobile search.");
    }
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
}


async function desktopSearch(numSearchesD,numSearchesM,searchType,searchGen) {
  if (searchType === "desktop") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = desktopUserAgent;
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
  await actualSearch(numSearchesD,numSearchesM, searchType, searchGen);
}

async function mobileSearch(numSearchesD,numSearchesM,searchType, searchGen) {
  if (searchType === "mobile") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = mobileUserAgent;
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
  await actualSearch(numSearchesD,numSearchesM, searchType, searchGen);
}

async function actualSearch(numSearchesD,numSearchesM, searchType, searchGen) {
  var searchCount = 0;
  var prevSearches = [];
  var numSearches=0 ;
  result="";
  if(searchType==="desktop"){
    numSearches = numSearchesD;
  }else if(searchType==="mobile"){
    numSearches =numSearchesM;
  }
  while (searchCount < numSearches) {
    if (searchGen == "precise") {
      var searchTerm = generateSearchTerm();
    } else if (searchGen == "random") {
      var searchTerm = "";
      if(searchType==="desktop"){
        searchTerm = generateString(numSearchesD);
      }else if(searchType==="mobile"){
        searchTerm = generateString(numSearchesM);
      }
      
    } else {
      console.log("Error, (Random/Preceise)");
      return;
    }

    if (stopSearch) {
      result = "";
      if (searchType === "mobile") {
        userAgent = desktopUserAgent;
      }
      // stopSearch = false;
      console.log("Stopped performing searches.");
      return;
    }

    if (prevSearches.includes(searchTerm)) {
      console.log("Skipping duplicate search term: " + searchTerm);
      continue;
    }
    prevSearches.push(searchTerm);

    var url = searchUrl + encodeURIComponent(searchTerm);

    if (activeTabId) {
      await new Promise((resolve) => {
        chrome.tabs.update(activeTabId, { url: url }, function (tab) {
          console.log("Searching for: " + searchTerm + " in " + searchType);
          resolve();
        });
      });
    } else {
      console.error("No active tab found.");
      return;
    }

    if (searchType === "mobile" && searchCount >= numSearches) {
      clearInterval(intervalId);
      result = "";
      if (searchType === "mobile") {
        userAgent = desktopUserAgent;
      }
      stopSearch = false;
      console.log("Finished performing searches.");
      return;
    }
    if(searchType==="desktop"&&searchCount >= numSearches){
      clearInterval(intervalId);
      stopSearch = true;
    }else{
      stopSearch = false;
    }
    searchCount++;
    await delay(1000);
  }
}


function generateString(numSearches){
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  if(result===""){
      for (var i = 0; i < numSearches; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }else{
    result=result.slice(0,-1);
  }
  return result;
}

function generateSearchTerm() {
  var adjectives = [
    "famous",
    "delicious",
    "scary",
    "fantastic",
    "beautiful",
    "silly",
    "colorful",
    "exciting",
    "amazing",
    "weird",
    "abrupt",
    "adorable",
    "amiable",
    "awkward",
    "bizarre",
    "blushing",
    "brisk",
    "calm",
    "charming",
    "cheerful",
    "clumsy",
    "cooperative",
    "courageous",
    "creative",
    "cute",
    "delightful",
    "determined",
    "diligent",
    "elegant",
    "enthusiastic",
    "fabulous",
    "friendly",
    "funny",
    "gentle",
    "glamorous",
    "gorgeous",
    "graceful",
    "hilarious",
    "humble",
    "innocent",
    "intelligent",
    "jolly",
    "kind-hearted",
    "lively",
    "lovely",
    "lucky",
    "magnificent",
    "mysterious",
    "naughty",
    "happy",
    "embarrassing",
    "tall",
    "uncomfortable",
    "suspicious",
    "goofy",
    "cowardly",
    "brave",
    "groovy",
    "abrupt"
  ];
  var nouns = [
    "dog",
    "cat",
    "robot",
    "unicorn",
    "dragon",
    "spaceship",
    "planet",
    "piano",
    "jungle",
    "mountain",
    "apple",
    "banana",
    "book",
    "bottle",
    "car",
    "chair",
    "cloud",
    "coffee",
    "computer",
    "cup",
    "desk",
    "door",
    "flower",
    "guitar",
    "hat",
    "house",
    "jacket",
    "key",
    "lamp",
    "leaf",
    "lightning",
    "moon",
    "motorcycle",
    "ocean",
    "painting",
    "phone",
    "pillow",
    "rain",
    "river",
    "shoe",
    "sky",
    "snowflake",
    "star",
    "sunflower",
    "table",
    "tree",
    "umbrella",
    "window",
    "tulu",
    "ron",
    "sagar",
    "bipin",
    "lee",
    "jadu",
    "game",
    "valo",
    "rohan",
    "tulasha",
    "rito",
    "video"
  ];

  var adjIndex = Math.floor(Math.random() * adjectives.length);
  var nounIndex = Math.floor(Math.random() * nouns.length);

  return adjectives[adjIndex] + " " + nouns[nounIndex];
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  
  if (message.type === "start-searches") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        activeTabId = tabs[0].id; // Store the tab ID of the active tab
        // performSearches(message.numSearches, message.searchType, message.searchGen);
      } else {
        console.error("No active tab found.");
      }
    });
    modeSearch(message.numSearchesD,message.numSearchesM, message.searchType, message.searchGen);
  } else if (message.type === "stop-searches") {
    stopSearch = true;
    clearInterval(intervalId);
    result="";
    console.log("Stopped performing searches.");
  }
});

// add webRequest listener at the end of the file
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'User-Agent') {
        details.requestHeaders[i].value = userAgent;
        break;
      }
    }
    return {requestHeaders: details.requestHeaders};
  },
  {urls:
 ["<all_urls>"]},
  ["blocking", "requestHeaders"]);
