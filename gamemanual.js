// This script can do multiple things... by default it does points 1, 2, 3, 4 and 5 listed below;
// 1. Authentication checks, Have to make sure you're getting those sweet points :)
// 2. Brings the Shopping Game to the top of the page
// 3. Forces the game to only have one answer option
// 4. Modifies countdown timer to 0 seconds
// 5. Updates visible user balance whenever points are awarded ( not sure why Microsoft didn't include this anyway... )
// 6. Automatically load next game instantly, skipping the 'Play Again' button + countdown timer ( needs to be enabled below! )
(async function(){
// // Change this variable to 'true' to bring the Shopping Game to the top of the page.
var switchAreaSlot = true;

// // Change this variable to 'true' to skip authentication check.
var skipAuthCheck = false;

// // Change this variable to 'true' to update visible user balance whenever points are awarded. ( 'skipAuthCheck' MUST be 'false' )
var autoUpdateRewardsBalance = true;

// // Change this variable to 'true' to skip the 'Play Again' button and countdown timer. ( a bit overpowered )
var autoLoadNextGame = true;

// // Change this variable to modify the countdown timer. ( it's in seconds )
var newGameCountdownTime = 0;
// Function to update variables based on received messages
function updateVariables(data) {
      switchAreaSlot = data.switchAreaSlot;
      skipAuthCheck = data.skipAuthCheck;
      autoUpdateRewardsBalance = data.autoUpdateRewardsBalance;
      autoLoadNextGame = data.autoLoadNextGame;
      newGameCountdownTime = data.newGameCountdownTime;
  }
  
  // Listen for messages from the content script
  window.addEventListener('message', function(event) {
    if (event.source === window && event.data) {
      updateVariables(event.data); // Update variables based on received data
    }
  });
  

// Basic query selectors to find 'msft-feed-layout', 'msn-shopping-game-pane' and 'ms-rewards' elements.
var msftFeedLayout = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout");

var msnShoppingGamePane = msftFeedLayout?.shadowRoot.querySelector("msn-shopping-game-pane");

var msRewards = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("common-header")
    ?.shadowRoot.querySelector("msn-verticals-header")
    ?.shadowRoot.querySelector("fluent-design-system-provider")
    ?.querySelector("ms-rewards");


// Function to see if we are authenticated.
async function rewardsConnectorAuthCheck(){
    if(!msRewards) 
    	return alert("'msRewards' not found, You may have ran the script too early?");

    var isRewardsUserUndefined = (msRewards?.rewardPoints == undefined);
    var tokenStorage = localStorage.getItem("1s-tokens");
    if(isRewardsUserUndefined){
    	if(tokenStorage){
            alert("You're semi-authenticated, The page will now reload.\nYou will need to re-run the script when the page has reloaded.");
			return document.location.reload();
		}

		// Authentication
        setTimeout(async () =>{
			document.body.innerHTML = "<div style='margin: 10px;'><span>You're unauthenticated! A popup should appear.<br>When you login you will need to re-run the script when the page has reloaded.</span></div>";
        }, 500);
		msnShoppingGamePane.signInState = 3;
		await msnShoppingGamePane.signIn();
    	await msnShoppingGamePane.fetchSignInState();
        setTimeout(() => document.location.href = 'https://www.msn.com/shopping?ocid=windirect', 2000);
    }
    else {
		if(tokenStorage){
			window.userAccessToken = JSON.parse(tokenStorage).accessToken;
			return true;
		}
		else {
			alert("You're authenticated but unable to find '1s-tokens', The page will now reload.\nYou will need to re-run the script when the page has reloaded.");
			return document.location.reload();
		}
	}
}

// Function that modifies the game.
function modifyGame(){
    // Check if the shopping game was found.
    if(msnShoppingGamePane != null)
    {
		// Switches msnShoppingGamePane slot with slot2, bringing it to the top of the page.
		if(switchAreaSlot){
			// if(msnShoppingGamePane.style.gridArea != "slot2"){
			// 	msftFeedLayout.shadowRoot.children[1].style.gridArea = msnShoppingGamePane.style.gridArea;
			// 	msnShoppingGamePane.style.gridArea = "slot2";
			// }
            msnShoppingGamePane.scrollIntoView({behavior: 'smooth'});
		}

		// Override their 'reportRewardsActivity' function with our own function for better point tracking.
		if(autoUpdateRewardsBalance){
			var rewardsBalanceElement;
			msnShoppingGamePane.reportRewardsActivity = async function(retryCount = 2){
				if(!rewardsBalanceElement)
					rewardsBalanceElement = msRewards?.shadowRoot?.querySelector("fluent-button")?.querySelector("span")?.querySelector("div");    
				
				var retryOnFail = function(){
					if(retryCount == 0) 
						alert("Failed reporting activity, You didn't get any points.");
					else 
						setTimeout(() => msnShoppingGamePane.reportRewardsActivity(retryCount-1), 333);
				}
			
				if(msRewards != null && autoUpdateRewardsBalance && rewardsBalanceElement && window.userAccessToken){
					await fetch("https://assets.msn.com/service/news/feed/segments/shopping?ocid=shopping-shophp-Peregrine&apikey=Xr2pbC1j5NMUwFF5YHTlhDDkcftEafmPoVP3pfA5eZ&timeOut=10000&cm=" + MeControl.Config.mkt.toLowerCase() + "&scn=MSNRPSAuth&$select=rewards|reportactivity|guessinggame&$filter=~5000&t=" + Date.now().toString(),{
						method: "GET",
						cache: "no-store",
						headers: {'Authorization': `Bearer ${window.userAccessToken}`}
					}).then(async (response) =>{
						if(response.status == 200){
							var reportActivityResponse = await response.json();    
							msnShoppingGamePane._rewardsBalance = JSON.parse(reportActivityResponse[0].data).Balance;
							rewardsBalanceElement.textContent = `\n${msnShoppingGamePane._rewardsBalance}\n\n`;
						}
						else retryOnFail();
					}).catch(() => {
						retryOnFail();
					});
				}
			};
		}
		
		// Modify the game settings countdown timer for new games. 
		msnShoppingGamePane.gameSettings.newGameCountdown = newGameCountdownTime;
		
        // Override their 'getGameResult' function with our own function which modifies the next game.
        msnShoppingGamePane.getGameResult = function(e) 
        {
            // Make sure a product card is selected or if 'e' is '-1' to reset the game.
            if (e === msnShoppingGamePane.selectedCardIndex)
            {
                // Modifies 'nextRoundShoppingEntities' to only contain 1 product.
                msnShoppingGamePane.nextRoundShoppingEntities = [msnShoppingGamePane.nextRoundShoppingEntities[0]];
            
                // Remove the 10 daily limit. ( still limited to 100 points daily )
                localStorage.removeItem("gamesPerDay");
                msnShoppingGamePane.dailyLimitReached = false;
                if(msnShoppingGamePane.leaderboardRecord)
                    msnShoppingGamePane.leaderboardRecord.dailyGuessingGamesPlayed = 0;
	 
                // This does multiple things...
                // Calls 'resetGame()' if 'e' is '-1'.
                // Checks if the game was won.
                // If the game was won it also checks if 'autoLoadNextGame' is 'true' and starts the next game if so.
                return e === -1 ? msnShoppingGamePane.resetGame() : msnShoppingGamePane.gameState === "win" ? (autoLoadNextGame ? msnShoppingGamePane.startNextGame() : "win") : "lose";
            }
        };

        //Calls the overridden 'getGameResult' function with the args '-1' to execute our code and reset the game.
        msnShoppingGamePane.selectedCardIndex = -1;
        msnShoppingGamePane.getGameResult(-1);
    }
    else alert("Unable to locate the shopping game!");
}


// This is the start...
if(skipAuthCheck || await rewardsConnectorAuthCheck()){
    modifyGame();
}
})();