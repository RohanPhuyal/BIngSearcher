function performSearches(numSearches, searchType) {
    var searchUrl;
    if (searchType === "desktop") {
      searchUrl = "https://www.bing.com/search?q=";
    } else if (searchType === "mobile") {
      searchUrl =
        "https://www.bing.com/search?q=&qs=n&form=QBRE&sp=-1&pq=&sc=8-0&sk=&cvid=&first=1";
    } else {
      console.error("Invalid search type: " + searchType);
      return;
    }
  
    var searchCount = 0;
    var prevSearches = [];
    var intervalId = setInterval(function () {
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
  
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "start-searches") {
      performSearches(message.numSearches, message.searchType);
    }
  });
  