// contentscript.js
var counter;
// Function to increment the counter and store it in the browser's storage
function incrementCounter() {
      counter = 1;
  }
  executeScript();
  // Call the incrementCounter function when the content script is executed
  incrementCounter();
  function executeScript(){
    if(counter>=1){
       var scroll = document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane");
      if(scroll==null){
        executeScript();
      }
      else{
        scroll.scrollIntoView({behavior: 'smooth'})
      }
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        s.onload = function() { this.remove(); };
        // see also "Dynamic values in the injected code" section in this answer
        (document.head || document.documentElement).appendChild(s);
        
    }
  }

