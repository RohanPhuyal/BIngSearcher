// var switchAreaSlot = document.getElementById("scroll-to-game").checked;
// var skipAuthCheck = document.getElementById("skip-auth").checked;
// var autoLoadNextGame = document.getElementById("auto-play-again").checked;
// var newGameCountdownTime = parseInt(document.getElementById("countdown-time").value);
// var autoUpdateRewardsBalance = !skipAuthCheck;
function gameFix() {
    var scroll = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");
    if(scroll){
      scroll.scrollIntoView({behavior: 'smooth'});
    }
    else{
      setInterval(gameFix,1000);
    }
  chrome.storage.local.set({ buttonClicked: "" });
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('gamefix.js');
  s.onload = function () {
    this.remove();
    // Code to be executed after the script is loaded and executed
  };
  (document.head || document.documentElement).appendChild(s);

}

chrome.storage.local.get(['buttonClicked'], function (result) {
  var buttonClicked = result.buttonClicked;
  if (typeof buttonClicked !== 'undefined') {
    if (buttonClicked === 'gameFixButton') {
      gameFix();
    }
  }
});
