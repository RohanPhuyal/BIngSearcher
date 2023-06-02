(function()
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
else console.error("Unable to locate the shopping game!");
})();
