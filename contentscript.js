  var scroll = document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane");

  function gameFix(){
     if(scroll==null){
      console.log(scroll);
      setTimeout(gameFix, 1000); // Retry after 100 milliseconds
      return;
     }
     else{
      chrome.storage.local.get(['buttonClicked'], function(result) {
        if(result.buttonClicked!=""){
          scroll.scrollIntoView({behavior: 'smooth'});
        }
      });
     }
     var s = document.createElement('script');
     s.src = chrome.runtime.getURL('gamefix.js');
     s.onload = function() {
       this.remove();
       // Code to be executed after the script is loaded and executed
     };
     (document.head || document.documentElement).appendChild(s);     
       chrome.storage.local.set({ buttonClicked: "" });
  }
  function sendToBg(){
    chrome.runtime.sendMessage({
      type: "game-fix-button"
    });
  }
  function gameManual(){
    if(scroll==null){
      console.log(scroll);
      setTimeout(gameFix, 1000); // Retry after 100 milliseconds
      return;
     }
     else{
      chrome.storage.local.get(['buttonClickedM'], function(result) {
        if(result.buttonClickedM!=""){
          scroll.scrollIntoView({behavior: 'smooth'});
        }
      });
     }
     var s = document.createElement('script');
     s.src = chrome.runtime.getURL('gamemanual.js');
     s.onload = function() {
       this.remove();
       // Code to be executed after the script is loaded and executed
     };
     (document.head || document.documentElement).appendChild(s);     
       chrome.storage.local.set({ buttonClickedM: "" });
  }
  

chrome.storage.local.get(['buttonClicked'], function(result) {
  var buttonClicked = result.buttonClicked;
  if (typeof buttonClicked !== 'undefined') {
     if (buttonClicked === 'gameFixButton') {
      console.log('gameFixButton was clicked');
      // sendToBg();
      gameFix();
    }
  }
});
chrome.storage.local.get(['buttonClickedM'], function(result) {
  var buttonClickedM = result.buttonClickedM;
  if (typeof buttonClickedM !== 'undefined') {
     if (buttonClickedM === 'gameManualButton') {
      console.log('gameFixButton was clicked');
      // sendToBg();
      gameManual();
    }
  }
});