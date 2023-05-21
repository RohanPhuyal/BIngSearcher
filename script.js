(function()
{
    if(!document.location.href.startsWith("https://www.msn.com/en-us/shopping")){
        console.error("Invalid page!");
        return;
    }
    
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
    
    var msnShoppingGamePane = null;
    for(i = 0; i <= shoppingPageChildren.length - 1; i++){
        if(shoppingPageChildren[i].getAttribute("gamestate") == "active")
            msnShoppingGamePane = shoppingPageChildren[i];
    }
    var answerSelectorInterval = (msnShoppingGamePane == null ? 0 : setInterval(() => 
    {
        if(msnShoppingGamePane.gameState == "active" && msnShoppingGamePane.selectedCardIndex != msnShoppingGamePane._correctAnswerIndex)
            msnShoppingGamePane.selectedCardIndex = msnShoppingGamePane._correctAnswerIndex;
        
        if(msnShoppingGamePane._dailyLimitReached){
            clearInterval(answerSelectorInterval);
        }
    }, 500));
    if (answerSelectorInterval == 0) {
        console.error("Unable to locate shopping game...\nTry scrolling down to it.");
      } else {
        console.log("Shopping game located!\nEnjoy :)");
      }
})();