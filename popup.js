document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("search-form");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var numSearches = document.getElementById("num-searches").value;
      var searchType = document.getElementById("search-type").value;
  
      chrome.runtime.sendMessage({
        type: "start-searches",
        numSearches: numSearches,
        searchType: searchType,
      });
    });
  });
  