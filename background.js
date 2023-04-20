var intervalId;
var desktopUserAgent = navigator.userAgent;
var mobileUserAgent = "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
var userAgent = navigator.userAgent;

function performSearches(numSearches, searchType) {
  var searchUrl;
  if (searchType === "desktop") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = desktopUserAgent;
  } else if (searchType === "mobile") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = mobileUserAgent;
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }

  var searchCount = 0;
  var prevSearches = [];
  intervalId = setInterval(function () {
    if (searchCount >= numSearches) {
      clearInterval(intervalId);
      // if(searchType === "mobile"){

      // }
      console.log("Finished performing searches.");
      return;
    }

    var searchTerm = generateSearchTerm();
    if (prevSearches.includes(searchTerm)) {
      console.log("Skipping duplicate search term: " + searchTerm);
      return;
    }
    prevSearches.push(searchTerm);

    var url = searchUrl + encodeURIComponent(searchTerm);

    chrome.tabs.update({ url: url }, function (tab) {
      console.log("Searching for: " + searchTerm);
    });

    searchCount++;
  }, 1000);
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
    performSearches(message.numSearches, message.searchType);
  } else if (message.type === "stop-searches") {
    clearInterval(intervalId);
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
