 /*var i=0;
console.log("Game Fix");
// var intervalID=setInterval(() =>
// {
    var msnShoppingGamePane = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");
    while(msnShoppingGamePane.getAttribute("gamestate")=="win"||msnShoppingGamePane.getAttribute("gamestate")=="idle"){
        msnShoppingGamePane.cardsPerGame = 1;
        msnShoppingGamePane.setAttribute('gamestate', 'active');
        msnShoppingGamePane.resetGame();
    }

    if(msnShoppingGamePane != null){
        msnShoppingGamePane.cardsPerGame = 1;
        msnShoppingGamePane.setAttribute('gamestate', 'active');
        msnShoppingGamePane.resetGame();
    }
    else console.error("Unable to locate the shopping game!"); */
    // if(i===10){
    //     clearInterval(intervalID);
    // }
    // i++;
// }, 1500);*/
(function()
{
    // if(!document.location.href.startsWith("https://www.msn.com/en-us/shopping")){
    //     console.error("Invalid page!");
    //     return;
    // }
    
    // var shoppingPageChildren = null;
    // try
    // {
    //     shoppingPageChildren = document.getElementsByTagName("shopping-page-base")[0].shadowRoot.children[0]
    //         .getElementsByTagName("shopping-homepage")[0].shadowRoot.children[0]
    //         .getElementsByTagName("msft-feed-layout")[0].shadowRoot.children;
    // }
    // catch(e)
    // {
    //     console.error("Script error...\nMake sure the page is fully loaded.");
    // }
    // var test=0;
    // var msnShoppingGamePane = null;
    // for(i = 0; i <= shoppingPageChildren.length - 1; i++){
    //     if(shoppingPageChildren[i].getAttribute("gamestate") == "idle"||shoppingPageChildren[i].getAttribute("gamestate")=="win")
    //         msnShoppingGamePane = shoppingPageChildren[i];
    // }
    // var answerSelectorInterval = (msnShoppingGamePane == null ? 0 : setInterval(() => 
    // {
    //     var msnShoppingGamePane1 = document.querySelector("shopping-page-base")
    // ?.shadowRoot.querySelector("shopping-homepage")
    // ?.shadowRoot.querySelector("msft-feed-layout")
    // ?.shadowRoot.querySelector("msn-shopping-game-pane");
 
    //     if(msnShoppingGamePane1.getAttribute("gamestate")=="win"||msnShoppingGamePane1.getAttribute("gamestate")=="idle"){
    //         msnShoppingGamePane1.cardsPerGame = 1;
    //         msnShoppingGamePane1.setAttribute('gamestate', 'active');
    //         msnShoppingGamePane1.resetGame();
    //     }
    //     if(test==10){
    //         clearInterval(answerSelectorInterval);
    //     }
    //     test++;
    // }, 500));
    // if (answerSelectorInterval == 0) {
    //     console.error("Unable to locate shopping game...\nTry scrolling down to it.");
    //   } else {
    //     console.log("Shopping game located!\nEnjoy :)");
    //   }

    var selectButton = document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane")
      ?.shadowRoot.querySelector("msft-stripe")
      ?.querySelector("fluent-card")
      ?.querySelector("msn-shopping-card").getElementsByClassName("shopping-select-overlay-button")[0];

        var msnShoppingGamePane2 = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");
    refreshGame();
    function selectButtonCLick(){
        selectButton.click();
    }
    function refreshGame(){
        if(msnShoppingGamePane2 != null){
            msnShoppingGamePane2.cardsPerGame = 1;
            msnShoppingGamePane2.setAttribute('gamestate', 'active');
            msnShoppingGamePane2.resetGame();
            if (selectButton) {
                console.log("Select Value Received");
                setTimeout(selectButtonCLick,3000);
              }
            else{
                console.log("Select Value Not Received");
            }
        }else{
            console.error("Unable to locate the shopping game!");
        }
        if(selectButton==null){
            console.log("NULL");
        }else{
            console.log("Not null");
        }
    }
    msnShoppingGamePane2.addEventListener('click', function(event) {
        console.log("MOUSE");

        refreshGame();
        });
        // if(msnShoppingGamePane2.getAttribute('gamestate')==='active'){
        //     console.log(msnShoppingGamePane2);
        //     setTimeout(gameFix, 1000);
        // }
        
})();
