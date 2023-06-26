var mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
var intervalId;
var searchType;
var searchGen;

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("search-form");
  var stopButton = document.getElementById("stop-button");
  var gameFixButton = document.getElementById("game-fix-button");
  var gameManualButton = document.getElementById("game-manual-button");

  var switchAreaSlot = document.getElementById("scroll-to-game");
  var skipAuthCheck = document.getElementById("skip-auth");
  var autoLoadNextGame = document.getElementById("auto-play-again");
  var newGameCountdownTime = document.getElementById("countdown-time");

  // Function to handle checkbox changes
  function handleCheckboxChange(event) {
    var checkboxId = event.target.id;
    var isChecked = event.target.checked;

    // Store the checkbox value in local storage
    chrome.storage.local.set({ [checkboxId]: isChecked });
  }

  // Function to handle countdown input change
  function handleCountdownInputChange(event) {
    var countdownValue = event.target.value;

    // Store the countdown value in local storage
    chrome.storage.local.set({ "countdown-time": countdownValue });
  }

  // Add event listeners for checkbox changes
  switchAreaSlot.addEventListener("change", handleCheckboxChange);
  skipAuthCheck.addEventListener("change", handleCheckboxChange);
  autoLoadNextGame.addEventListener("change", handleCheckboxChange);

  // Add event listener for countdown input change
  newGameCountdownTime.addEventListener("input", handleCountdownInputChange);

  // Retrieve checkbox values from storage and update the checkboxes
  chrome.storage.local.get(
    {
      "scroll-to-game": true, // Default value if not found in storage
      "skip-auth": false, // Default value if not found in storage
      "auto-play-again": true, // Default value if not found in storage
      "countdown-time": 0, // Default value if not found in storage
    },
    function (data) {
      switchAreaSlot.checked = data["scroll-to-game"];
      skipAuthCheck.checked = data["skip-auth"];
      autoLoadNextGame.checked = data["auto-play-again"];
      newGameCountdownTime.value = data["countdown-time"];
    }
  );

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
    var numSearchesD = document.getElementById("num-searchesD").value;
    var numSearchesM = document.getElementById("num-searchesM").value;
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
      numSearchesD: numSearchesD,
      numSearchesM: numSearchesM,
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
  chrome.storage.sync.get("lastSearchValueD", function (data) {
    if (data.lastSearchValueD) {
      document.getElementById("num-searchesD").value = data.lastSearchValueD;
    }
  });
  // Retrieve the last value searched by the user (if any)
  chrome.storage.sync.get("lastSearchValueM", function (data) {
    if (data.lastSearchValueM) {
      document.getElementById("num-searchesM").value = data.lastSearchValueM;
    }
  });
  // Retrieve the last value searched by the user (if any)
  chrome.storage.sync.get("lastTypeValue", function (data) {
    if (data.lastTypeValue) {
      document.getElementById("search-type").value = data.lastTypeValue;
    }
  });
  // Retrieve the last value searched by the user (if any)
  chrome.storage.sync.get("lastMethodValue", function (data) {
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
  document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const numSearchesD = document.getElementById("num-searchesD").value;
    const numSearchesM = document.getElementById("num-searchesM").value;
    const searchType = document.getElementById("search-type").value;
    const searchGen = document.querySelector('input[name="search-gen"]:checked').value;
    // Save the search value to storage
    chrome.storage.sync.set({ lastSearchValueD: numSearchesD });
    chrome.storage.sync.set({ lastSearchValueM: numSearchesM });
    chrome.storage.sync.set({ lastTypeValue: searchType });
    chrome.storage.sync.set({ lastMethodValue: searchGen });
  });

  gameFixButton.addEventListener('click', function () {
    // Send a message to the content script with the values
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var switchAreaSlot1 = document.getElementById("scroll-to-game").checked;
      var skipAuthCheck1 = document.getElementById("skip-auth").checked;
      var autoLoadNextGame1 = document.getElementById("auto-play-again").checked;
      var newGameCountdownTime1 = parseInt(document.getElementById("countdown-time").value);
      var autoUpdateRewardsBalance = !skipAuthCheck1;
      console.log(switchAreaSlot + ", "+ skipAuthCheck+ ", "+autoLoadNextGame+ ", "+newGameCountdownTime+ ", "+autoUpdateRewardsBalance);
      chrome.tabs.sendMessage(tabs[0].id, {
        switchAreaSlot: switchAreaSlot1,
        skipAuthCheck: skipAuthCheck1,
        autoLoadNextGame: false,
        newGameCountdownTime: newGameCountdownTime1,
        autoUpdateRewardsBalance: autoUpdateRewardsBalance
      });
    });
    var buttonClicked = "gameFixButton";
    chrome.storage.local.set({ buttonClicked: buttonClicked }, function () {
      chrome.tabs.executeScript({
        file: 'contentscript.js'
      });
    });
  });
  gameManualButton.addEventListener('click', function () {
      // Send a message to the content script with the values
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var switchAreaSlot1 = document.getElementById("scroll-to-game").checked;
    var skipAuthCheck1 = document.getElementById("skip-auth").checked;
    var autoLoadNextGame1 = document.getElementById("auto-play-again").checked;
    var newGameCountdownTime1 = parseInt(document.getElementById("countdown-time").value);
    var autoUpdateRewardsBalance = !skipAuthCheck1;
    console.log(switchAreaSlot + ", "+ skipAuthCheck+ ", "+autoLoadNextGame+ ", "+newGameCountdownTime+ ", "+autoUpdateRewardsBalance);
    chrome.tabs.sendMessage(tabs[0].id, {
      switchAreaSlot: switchAreaSlot1,
      skipAuthCheck: skipAuthCheck1,
      autoLoadNextGame: autoLoadNextGame1,
      newGameCountdownTime: newGameCountdownTime1,
      autoUpdateRewardsBalance: autoUpdateRewardsBalance
    });
  });
    var buttonClickedM = "gameManualButton";
    chrome.storage.local.set({ buttonClickedM: buttonClickedM }, function () {
      chrome.tabs.executeScript({
        file: 'contentscript.js'
      });
    });
  });


  // gameButton.addEventListener('click', function() {
  //   chrome.tabs.executeScript({
  //     file: 'contentscript.js',
  //     code: 'var buttonClicked = "gameButton";'
  //   });
  // });
  // gameFixButton.addEventListener('click', function() {
  //   chrome.tabs.executeScript({
  //     file: 'contentscript.js',
  //     code: 'var buttonClicked = "gameFixButton";'
  //   });
  // });


});
