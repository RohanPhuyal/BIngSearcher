var intervalId;
var desktopUserAgent = navigator.userAgent;
var mobileUserAgent = "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
// var mobileUserAgent = "Mozilla/5.0 (Linux; {Android Version}; {Build Tag etc.}) AppleWebKit/{WebKit Rev} (KHTML, like Gecko) Chrome/{Chrome Rev} Mobile Safari/{WebKit Rev}";
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
    
    if (numSearchesM > 0) {
      await mobileSearch(numSearchesD,numSearchesM,"mobileM", searchGen);
      console.log("Finished performing mobile search.");
    }

    await desktopSearch(numSearchesD,numSearchesM,"desktopD" ,searchGen);
    console.log("Finished performing desktop search.");

    // await delay(numSearchesD * 1000);
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
}


async function desktopSearch(numSearchesD,numSearchesM,searchType,searchGen) {
  if (searchType === "desktop"||searchType === "desktopD") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = desktopUserAgent;
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
  await actualSearch(numSearchesD,numSearchesM, searchType, searchGen);
}

async function mobileSearch(numSearchesD,numSearchesM,searchType, searchGen) {
  if (searchType === "mobile"||searchType === "mobileM") {
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
  if(searchType==="desktop" ||searchType==="desktopD"){
    numSearches = numSearchesD;
  }else if(searchType==="mobile"||searchType==="mobileM"){
    numSearches =numSearchesM;
  }
  while (searchCount < numSearches) {
    if (searchGen == "precise") {
      var searchTerm = await generateSearchTerm();
    } else if (searchGen == "random") {
      var searchTerm = "";
      if(searchType==="desktop"||searchType==="desktopD"){
        searchTerm = await generateString(numSearchesD);
      }else if(searchType==="mobile"||searchType==="mobileM"){
        searchTerm = await generateString(numSearchesM);
      }
      
    } else {
      console.log("Error, (Random/Preceise)");
      return;
    }

    if (stopSearch) {
      result = "";
      if (searchType === "mobile"||searchType==="mobileM") {
        userAgent = desktopUserAgent;
      }
      if(searchType==="desktopD"){
        stopSearch = true;
      }
      console.log("Stopped performing searches.");
      return;
    }

    if (prevSearches.includes(searchTerm)) {
      console.log("Skipping duplicate search term: " + searchTerm);
      continue;
    }
    prevSearches.push(searchTerm);

    var url = searchUrl + encodeURIComponent(searchTerm);

    // if (activeTabId) {
    //   await new Promise((resolve) => {
    //     chrome.tabs.update(activeTabId, { url: url }, function (tab) {
    //       console.log("Searching for: " + searchTerm + " in " + searchType);
    //       resolve();
    //     });
    //   });
    // } 
    if (activeTabId) {
      // Update tab URL
      chrome.tabs.update(activeTabId, { url: url }, async function (tab) {
        console.log("Searching for: " + searchTerm + " in " + searchType);

        // Wait for the tab to be fully loaded
        await new Promise((resolve) => {
          // Listen for tab load completion
          chrome.tabs.onUpdated.addListener(function onTabUpdated(tabId, changeInfo) {
            console.log("Tab Id: " + tabId);
            if (tabId === activeTabId && changeInfo.status === "complete") {
              // Website is fully loaded, resolve the promise
              console.log("Website is fully loaded.");
              chrome.tabs.onUpdated.removeListener(onTabUpdated);
              resolve();
            }
          });
        });
        console.log("kati time execute yo");
        // Perform another search or further actions
        // actualSearch(numSearchesD, numSearchesM, searchType, searchGen);
      });

    }else {
      chrome.runtime.sendMessage({
        type: "start-searches",
        numSearchesD: numSearchesD,
        numSearchesM: numSearchesM,
        searchType: searchType,
        searchGen: searchGen,
      });
    }
    if(searchCount >= numSearches){
      result="";
      userAgent = desktopUserAgent;
      clearInterval(intervalId);
      if (searchType === "mobile"||searchType==="mobileM") {
        userAgent = desktopUserAgent;
      }
      console.log("Finished performing searches.");
      return;
    }
    searchCount++;
    await delay(1000);
  }
}
async function generateString(numSearches) {
  return new Promise((resolve) => {
    setTimeout(() => {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  if (result === "") {
    for (var i = 0; i < numSearches; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  } else {
    result = result.slice(0, -1);
  }
  resolve(result);
    }, 0);
  });
}

async function generateSearchTerm() {
  return new Promise((resolve) => {
    setTimeout(() => {

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

  resolve(adjectives[adjIndex] + " " + nouns[nounIndex]);
}, 0);
});
}
var tabId=null;
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
    stopSearch=false;
    modeSearch(message.numSearchesD,message.numSearchesM, message.searchType, message.searchGen);
  } else if (message.type === "stop-searches") {
    stopSearch = true;
    userAgent = desktopUserAgent;
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
