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
    
    var shoppingPageChildren = null;
    try
    {
        shoppingPageChildren = document.getElementsByTagName("shopping-page-base")[0].shadowRoot.children[0]
            .getElementsByTagName("shopping-homepage")[0].shadowRoot.children[0]
            .getElementsByTagName("msft-feed-layout")[0].shadowRoot.children;
    }
    catch(e)
    {
        console.error("Script error...\nMake sure the page is fully loaded.");
        return;
    }
    var test=0;
    var msnShoppingGamePane = null;
    for(i = 0; i <= shoppingPageChildren.length - 1; i++){
        if(shoppingPageChildren[i].getAttribute("gamestate") == "idle"||shoppingPageChildren[i].getAttribute("gamestate")=="win")
            msnShoppingGamePane = shoppingPageChildren[i];
    }
    var answerSelectorInterval = (msnShoppingGamePane == null ? 0 : setInterval(() => 
    {
        var msnShoppingGamePane = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");
 
        if(msnShoppingGamePane != null){
            msnShoppingGamePane.cardsPerGame = 1;
        msnShoppingGamePane.setAttribute('gamestate', 'active');
            msnShoppingGamePane.resetGame();

}
else alert("Unable to locate the shopping game!");
        if(test==10){
            clearInterval(answerSelectorInterval);
        }
        test++;
    }, 500));
    if (answerSelectorInterval == 0) {
        console.error("Unable to locate shopping game...\nTry scrolling down to it.");
      } else {
        console.log("Shopping game located!\nEnjoy :)");
      }
})();
