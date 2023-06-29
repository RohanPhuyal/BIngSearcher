(function () {
  var msnShoppingGamePane = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");

  if (msnShoppingGamePane != null) {
    msnShoppingGamePane.gameSettings.newGameCountdown = 0;
    msnShoppingGamePane.fetchGameDataFunc = async function (e) {
      return JSON.parse(`[{"id":"46154567668","title":"HUGO BOSS BOSS BOTTLED. NIGHT. Eau De Toilette 200ml Spray","dealPercentage":"1%","annotation":"1%","seller":"The Fragrance Shop","imageInfo":{"altText":"HUGO BOSS BOSS BOTTLED. NIGHT. Eau De Toilette 200ml Spray","sourceImageUrl":"https://th.bing.com/th?id=OPE.vyeLua8uaC6Jcw300C300&pid=21.1","imageTint":0},"priceInfo":{"originalPrice":"£1.00","price":"£1.00","priceCurrencySymbol":"£"},"productAdsScenarioType":18,"groupingIdType":3,"groupingId":"I39JqFOmQioZw8YvP0AVBb6pw4","globalOfferId":"46154567668","categoryInfo_2":{"categoryId":"4285","categoryName":"Fragrance","categoryHierarchy":"Beauty & Fragrance|Fragrance"},"shippingPrice":"","sourceType":"xnp","brq":""}]`);
    }
    msnShoppingGamePane.getGameResult = function (e) {
      // Make sure a product card is selected or if 'e' is '-1' to reset the game.
      if (e === msnShoppingGamePane.selectedCardIndex) {
        localStorage.removeItem("gamesPerDay");
        msnShoppingGamePane.dailyLimitReached = false;
        if (msnShoppingGamePane.leaderboardRecord)
          msnShoppingGamePane.leaderboardRecord.dailyGuessingGamesPlayed = 0;
        return e === msnShoppingGamePane.selectedCardIndex ? msnShoppingGamePane.gameState === "win" ? "win" : "lose" : null;
      }
    };
    msnShoppingGamePane.gameSettings.newGameCountdown = 0;
    msnShoppingGamePane.getGameResult(-1);
    msnShoppingGamePane.gameState = "win";
    msnShoppingGamePane.startCountdown();
    msnShoppingGamePane.startCountdown();
    setTimeout(() => {
      for (var i = 0; i <= 10000; i++) clearInterval(i);
      msnShoppingGamePane.gameSettings.newGameCountdown = 6;
    }, 2200);
  }
  else alert("Unable to locate the shopping game!");
})();