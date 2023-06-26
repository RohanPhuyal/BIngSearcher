// var switchAreaSlot = document.getElementById("scroll-to-game").checked;
// var skipAuthCheck = document.getElementById("skip-auth").checked;
// var autoLoadNextGame = document.getElementById("auto-play-again").checked;
// var newGameCountdownTime = parseInt(document.getElementById("countdown-time").value);
// var autoUpdateRewardsBalance = !skipAuthCheck;

var switchAreaSlot;
var skipAuthCheck;
var autoLoadNextGame;
var newGameCountdownTime;
var autoUpdateRewardsBalance;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switchAreaSlot = message.switchAreaSlot;
  skipAuthCheck = message.skipAuthCheck;
  autoLoadNextGame = message.autoLoadNextGame;
  newGameCountdownTime = message.newGameCountdownTime;
  autoUpdateRewardsBalance = message.autoUpdateRewardsBalance;
  console.log("content listen");
  // Your code that uses the received values here
});

function gameFix() {
  if(switchAreaSlot){
    document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane").scrollIntoView({behavior: 'smooth'});
  }
  chrome.storage.local.set({ buttonClicked: "" });
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('gamefix.js');
  s.onload = function () {
    this.remove();
    // Code to be executed after the script is loaded and executed
    window.postMessage({
      switchAreaSlot: switchAreaSlot,
      skipAuthCheck: skipAuthCheck,
      autoUpdateRewardsBalance: autoUpdateRewardsBalance,
      autoLoadNextGame: false,
      newGameCountdownTime: newGameCountdownTime
    }, '*');
  };
  (document.head || document.documentElement).appendChild(s);

}
function gameManual() {
  if(switchAreaSlot){
    document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane").scrollIntoView({behavior: 'smooth'});
  }
  chrome.storage.local.set({ buttonClickedM: "" });
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('gamemanual.js');
  s.onload = function () {
    this.remove();

    // Code to be executed after the script is loaded and executed

    // Send a message to gamemanual.js with the desired values
    window.postMessage({
      switchAreaSlot: switchAreaSlot,
      skipAuthCheck: skipAuthCheck,
      autoUpdateRewardsBalance: autoUpdateRewardsBalance,
      autoLoadNextGame: autoLoadNextGame,
      newGameCountdownTime: newGameCountdownTime
    }, '*');
  };
  (document.head || document.documentElement).appendChild(s);


}


chrome.storage.local.get(['buttonClicked'], function (result) {
  var buttonClicked = result.buttonClicked;
  if (typeof buttonClicked !== 'undefined') {
    if (buttonClicked === 'gameFixButton') {
      console.log('gameFixButton was clicked');
      gameFix();
    }
  }
});
chrome.storage.local.get(['buttonClickedM'], function (result) {
  var buttonClickedM = result.buttonClickedM;
  if (typeof buttonClickedM !== 'undefined') {
    if (buttonClickedM === 'gameManualButton') {
      console.log('gameFixButton was clicked');
      gameManual();
    }
  }
});
