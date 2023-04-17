document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("search-form");
  var stopButton = document.getElementById("stop-button");

  var intervalId;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var numSearches = document.getElementById("num-searches").value;
    var searchType = document.getElementById("search-type").value;

    chrome.runtime.sendMessage({
      type: "start-searches",
      numSearches: numSearches,
      searchType: searchType,
    });

    // Store the interval ID so that it can be cleared later
    intervalId = setInterval(function () {}, 1000);
  });

  stopButton.addEventListener("click", function (event) {
    clearInterval(intervalId);
    chrome.runtime.sendMessage({ type: "stop-searches" });
  });
});
