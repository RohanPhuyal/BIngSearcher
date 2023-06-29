var msnShoppingGamePane = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");
 
if(msnShoppingGamePane != null){
	msnShoppingGamePane.gameSettings.newGameCountdown = 0;
	msnShoppingGamePane.style.gridArea = "slot2";
    msnShoppingGamePane.getGameResult = function(e) {
        if (e === msnShoppingGamePane.selectedCardIndex){
            localStorage.removeItem("gamesPerDay");
			msnShoppingGamePane.dailyLimitReached = false;
            if(msnShoppingGamePane.leaderboardRecord)
                msnShoppingGamePane.leaderboardRecord.dailyGuessingGamesPlayed = 0;
            return e === -1 ? shoppingGamePane.setAttribute('gamestate','active') : msnShoppingGamePane.gameState === "win" ? "win" : "lose";
        }
    };
    msnShoppingGamePane.getGameResult(-1);
}
else alert("Unable to locate the shopping game!");
