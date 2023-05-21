var mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
var intervalId;
var searchType;
var searchGen;

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("search-form");
  var stopButton = document.getElementById("stop-button");
  var gameButton = document.getElementById("game-button");

  // Define the webRequest listener
  function modifyUserAgent(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === "User-Agent") {
        details.requestHeaders[i].value = mobileUserAgent;
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  }

  // Add event listeners
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var numSearches = document.getElementById("num-searches").value;
    searchType = document.getElementById("search-type").value;
    searchGen = document.querySelector('input[name="search-gen"]:checked').value;

    // Add the webRequest listener if mobile search is selected
    if (searchType === "mobile") {
      chrome.webRequest.onBeforeSendHeaders.addListener(
        modifyUserAgent,
        { urls: ["<all_urls>"] },
        ["blocking", "requestHeaders"]
      );
    }

    // Send message to background script to start searches
    chrome.runtime.sendMessage({
      type: "start-searches",
      numSearches: numSearches,
      searchType: searchType,
      searchGen: searchGen,
    });

    // Store the interval ID so that it can be cleared later
    intervalId = setInterval(function () {
      // Do something at each interval, if needed
    }, 1000);
  });

  stopButton.addEventListener("click", function (event) {
    clearInterval(intervalId);

    // Remove the webRequest listener if mobile search is selected
    if (searchType === "mobile") {
      chrome.webRequest.onBeforeSendHeaders.removeListener(modifyUserAgent);
    }

    // Send message to background script to stop searches
    chrome.runtime.sendMessage({ type: "stop-searches" });
  });

  // Retrieve the last value searched by the user (if any)
  chrome.storage.sync.get("lastSearchValue", function(data) {
    if (data.lastSearchValue) {
      document.getElementById("num-searches").value = data.lastSearchValue;
    }
  });
  // Retrieve the last value searched by the user (if any)
  chrome.storage.sync.get("lastTypeValue", function(data) {
    if (data.lastTypeValue) {
      document.getElementById("search-type").value = data.lastTypeValue;
    }
  });
  // Retrieve the last value searched by the user (if any)
  chrome.storage.sync.get("lastMethodValue", function(data) {
    if (data.lastMethodValue) {
      var searchGen = data.lastMethodValue;
      var radioButtons = document.querySelectorAll('input[name="search-gen"]');
      for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].value === searchGen) {
          radioButtons[i].checked = true;
          break;
        }
      }
    }
  });
  

  // Listen for form submission and save the search value to storage
  document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const numSearches = document.getElementById("num-searches").value;
    const searchType = document.getElementById("search-type").value;
    const searchGen = document.querySelector('input[name="search-gen"]:checked').value;
    // Save the search value to storage
    chrome.storage.sync.set({ lastSearchValue: numSearches });
    chrome.storage.sync.set({ lastTypeValue: searchType });
    chrome.storage.sync.set({ lastMethodValue: searchGen });
    // Perform search based on user selection
    // performSearch(numSearches, searchType);
  });

  // gameButton.addEventListener("click",function (event){
  //   chrome.runtime.sendMessage({ type: "game-script" });
  // });
  gameButton.addEventListener('click', function() {
    chrome.tabs.executeScript({
      file: 'contentscript.js'
    });
  });


});
