var intervalId;
function performSearches(numSearches, searchType) {
  var searchUrl;
  var userAgent;
  if (searchType === "desktop") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = navigator.userAgent;
  } else if (searchType === "mobile") {
    // searchUrl =
    //   "https://www.bing.com/search?q=&qs=n&form=QBRE&sp=-1&pq=&sc=8-0&sk=&cvid=&first=1&mkt=en-US";
    searchUrl =
      "https://www.bing.com/search?q";
      userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1";
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }

  var searchCount = 0;
  var prevSearches = [];
  intervalId = setInterval(function () {
    if (searchCount >= numSearches) {
      clearInterval(intervalId);
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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "start-searches") {
    performSearches(message.numSearches, message.searchType);
  } else if (message.type === "stop-searches") {
    clearInterval(intervalId);
    console.log("Stopped performing searches.");
  }
});

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
    "happy",
    "embarrassing",
    "tall",
    "delicious",
    "uncomfortable",
    "clumsy",
    "suspicious",
    "goofy",
    "cowardly",
    "brave",
    "groovy",
    
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
    "ron",
    "sagar",
    "bipin",
    "lee",
    "jadu",
    "game",
    "valo",
    "rohan",
    "rito",
    "video",
  ];

  var adjIndex = Math.floor(Math.random() * adjectives.length);
  var nounIndex = Math.floor(Math.random() * nouns.length);

  return adjectives[adjIndex] + " " + nouns[nounIndex];
}