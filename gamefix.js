// Change this variable to 'true' to bring the Shopping Game to the top of the page.
var switchAreaSlot = false;

// Change this variable to 'true' to show the custom game counter.
var showCustomGameCounter = true;

// Change this variable to 'true' to show the custom points counter.
var showCustomPointsCounter = true;

// Change this variable to 'true' to automatically click 'Play Again' on game complete.
var autoReplay = true;


// Basic query selectors to find 'msft-feed-layout', 'msn-shopping-game-pane' and 'ms-rewards' elements.
var msftFeedLayout = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout");

var msnShoppingGamePane = msftFeedLayout?.shadowRoot.querySelector("msn-shopping-game-pane");

var fluentDesignSystemProvider = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("common-header")
    ?.shadowRoot.querySelector("msn-verticals-header")
    ?.shadowRoot.querySelector("fluent-design-system-provider");

// Function to make sure we're on MSN shopping page.
function validUrlCheck(){
	var isValidUrl = document.location.href.includes("https://www.msn.com/") && document.location.href.includes("/shopping");
    return isValidUrl ? true : alert("Invalid site detected. You need to be on https://www.msn.com/shopping");
}

// Function to try get user accessToken if 1s-tokens not present.
function tryGetUserAccessToken(){
    for(var i = 0; i <= 100000; i ++){
        var val = localStorage.key(i);
        if(!val) break;
        if(val.includes("accesstoken") && val.includes("oneservice")){
            return JSON.parse(localStorage.getItem(val)).secret;
        }
    }
    return null;
}

// Function to try get 'common.js' url which is fetched by 'tryGetOneServiceApiKey' to extract 'OneServiceApiKey'.
function tryGetCommonJsUrl(){
	var scriptTags = document.getElementsByTagName("script");
	var jsFiles = [];
	for (var i = 0; i < scriptTags.length; i++) {
	const src = scriptTags[i].getAttribute("src");
		if (src && src.endsWith(".js")) {
			jsFiles.push(src);
		}
	}
	return jsFiles.findLast((item) => item.includes("/common."));
}

// Function to try get 'OneServiceApiKey' used in 'reportActivity' url. ( Must be a better way of retrieving this... )
async function tryGetOneServiceApiKey(){
	var commonJsUrl = tryGetCommonJsUrl();
	if(!commonJsUrl) return null;
    var serviceWorker = await fetch(commonJsUrl);
    var body = serviceWorker.ok ? await serviceWorker.text() : null;
    window.oneServiceApiKey = body ? body.includes("apiKey") ? body.split('apiKey:"')[1].split('"')[0] : null : null;
	return window.oneServiceApiKey;
}

// Function to get 'ActivityId' used in 'reportActivity' url.
function tryGetActivityId(){
	var dataClientSettings = document.head.getAttribute("data-client-settings");
	window.activityId = dataClientSettings ? JSON.parse(dataClientSettings).aid.replace(/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, "$1-$2-$3-$4-$5") : MeControl.WebInline.guid();
    return window.activityId;
}

// Function to get 'MUID' used in 'reportActivity' url.
async function tryGetMuid(){
    var muid = await cookieStore.get("MUID");
    window.muid = muid ? `m-${muid.value}` : null;
	return window.muid;
}

// Function to check OneServiceApiKey, ActivityId, MUID.
async function setupReportActivityUrl(){
	if(!await tryGetMuid()) return alert("Unable to retrieve 'MUID'");
	if(!await tryGetActivityId()) return alert("Unable to retrieve 'ActivityId'");
	if(!await tryGetOneServiceApiKey()) return alert("Unable to retrieve 'OneServiceApiKey'");
	return true;
}

// Function to create button elements at the top left of the shopping game.
function createButtonElement(){
	if(!window.elementsCreated) 
		window.elementsCreated = 0;
	var divElem = document.createElement("div");
    divElem.className = "view-leaderboard stats-game-counter";
    divElem.style = `right: unset; left: ${25+(window.elementsCreated++ * 100)}px; font-size: 13px;background: linear-gradient(100.25deg, rgba(7, 158, 130, 0.9) 0%, rgba(2, 100, 188, 0.9) 100%);color: white;font-weight: 700;`;
    var parentElem = msnShoppingGamePane.gameContainerRef.getElementsByClassName("game-panel-container")[0];
    parentElem.appendChild(divElem);
	return divElem;
}

// Function to create and increment the game counter.
function incrementGameCounter(){
    if(!window.gameCounterElem){
        window.gameCounter = 0;
        window.gameCounterElem = createButtonElement();
    }
    window.gameCounter++;
    window.gameCounterElem.textContent = `Game: ${window.gameCounter}`;
}

// Function to create and increment the points counter, Also increments the default BingFlyout points counter.
function incrementPointsCounter(balance = 0){
	if(!window.rewardsBalanceElement)
		window.rewardsBalanceElement = fluentDesignSystemProvider?.querySelector("ms-rewards")?.shadowRoot?.querySelector("fluent-button")?.getElementsByClassName("reward-points")[0];
    
	if(!window.pointsCounterElem){
        window.pointsBalancePrev = balance-1;
		window.pointsBalance = balance;
        window.pointsCounterElem = createButtonElement();
		
		window.pointsIncrementTimer = setInterval(() => {
			if(window.pointsBalance > window.pointsBalancePrev){
				// Update our custom balance points text.
				window.pointsCounterElem.textContent = `Points: ${++window.pointsBalancePrev}`;
				
				// Update BingFlyout balance points text.
				if(window.rewardsBalanceElement)
					window.rewardsBalanceElement.textContent = `\n${window.pointsBalancePrev}\n\n`;
			}
		}, 50);
    }
    window.pointsBalance = balance;
}

// Function to update user balance, Which then updates the points counters.
async function updateUserPointsBalance(){
	await fetch("https://assets.msn.com/service/News/Users/me/Rewards?apikey=0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM&ocid=rewards-peregrine&cm=en-gb&it=web&user=0&scn=ANON",
	{
		headers: { "Authorization": `Bearer ${window.userAccessToken}` }
	}).then(async (response) => {
		var userInfo = await response.json();
		incrementPointsCounter(userInfo.profile.rewardsPoints);
	});
}

// Function to report the 'guessinggame' activity.
async function reportActivity(){
    return await fetch(`https://assets.msn.com/service/news/feed/segments/shopping?ocid=shopping-shophp-Peregrine&apikey=${window.oneServiceApiKey}&timeOut=10000&cm=${MeControl.Config.mkt.toLowerCase()}&scn=MSNRPSAuth&user=${window.muid}&$select=rewards|reportactivity|guessinggame|0|${window.gameHash}&$filter=~5000&activityid=${window.activityId}`,{
		method: "GET",
		cache: "no-store",
		headers: {'Authorization': `Bearer ${window.userAccessToken}`}
	});
}

// Function to see if we are authenticated.
async function rewardsConnectorAuthCheck(){
	var accessToken = tryGetUserAccessToken();
    var tokenStorage = localStorage.getItem("1s-tokens");
	if(tokenStorage || accessToken){
		window.userAccessToken = (accessToken ? accessToken : JSON.parse(tokenStorage).accessToken);
		msnShoppingGamePane.signInState = 1;
		return true;
	}
	else
	{
		alert("Unable to find '1s-tokens', The page will now reload.\nYou will need to re-run the script when the page has reloaded.");
		return document.location.reload();
	}
}

// Function that modifies the game products.
function modifyGameProducts(){
    msnShoppingGamePane.displayedShoppingEntities = [msnShoppingGamePane.displayedShoppingEntities[0]];
}

// Function to remove the 10 daily game limit. ( still limited to 100 points daily )
function removeDailyGameLimit(){
	if(msnShoppingGamePane.displayedShoppingEntities.length > 1) 
		modifyGameProducts();

    localStorage.removeItem("gamesPerDay");
    msnShoppingGamePane.dailyLimitReached = false;
    if(msnShoppingGamePane.leaderboardRecord)
		msnShoppingGamePane.leaderboardRecord.dailyGuessingGamesPlayed = 0;
	
	msnShoppingGamePane.gameState = (msnShoppingGamePane.gameState == "idle" ? "active" : msnShoppingGamePane.gameState);
}

// Function that modifies the game.
async function modifyGame(){
	// Get the game hash.
    window.gameHash = msnShoppingGamePane.displayedShoppingEntities[0].gameHash;
	
	// Check if the shopping game was found.
    if(msnShoppingGamePane != null)
    {		
		// Switches msnShoppingGamePane slot with slot2, bringing it to the top of the page.
		if(switchAreaSlot){
			if(msnShoppingGamePane.style.gridArea != "slot2"){
				msftFeedLayout.shadowRoot.children[1].style.gridArea = msnShoppingGamePane.style.gridArea;
				msnShoppingGamePane.style.gridArea = "slot2";

                // Scroll to the top of the page, For people who scroll down before running the script.
                window.scrollTo(0,0);
			}
			
			// Keep the game at the top when layout changes.
			if(!window.layoutColumnsChangedOG){
				window.layoutColumnsChangedOG = msnShoppingGamePane.layoutColumnsChanged;
				msnShoppingGamePane.layoutColumnsChanged = function(e, t){
					layoutColumnsChangedOG.call(msnShoppingGamePane, [e, t]);
					msnShoppingGamePane.style.gridArea = "slot2";
				}
			}
		}
		
		// Override their 'startCountdown' so we can increment the game count.
		if(showCustomGameCounter && !window.startCountdownOG){
			window.startCountdownOG = msnShoppingGamePane.startCountdown;
			msnShoppingGamePane.startCountdown = function(){
				window.startCountdownOG.call(msnShoppingGamePane);
				setTimeout(() => {
					incrementGameCounter();
					modifyGameProducts();
				}, (msnShoppingGamePane.gameSettings.newGameCountdown * 1000) + 1200);
			}
		}
		
		// Get initial user balance.
		if(showCustomPointsCounter)
			updateUserPointsBalance();
		
		// Override their gSCS to always return green.
		msnShoppingGamePane.gSCS = function (e) {
			return msnShoppingGamePane.isGameFinished ? "--price-color:#00AE56;--price-color-dark:#00AE56" : "";
		}
		
        // Override their 'getGameResult' function with our own to execute 'autoReplay' and 'updateUserPointsBalance' on game complete, Also removes the 10 game limit.
        msnShoppingGamePane.getGameResult = async function(e) 
        {
            // Make sure a product card is selected.
            if (msnShoppingGamePane.isGameFinished)
            {
				// Change current gameState to 'win'.
				msnShoppingGamePane.gameState = 'win';

				// Remove daily game limit.
				removeDailyGameLimit();

				// Report 'guessinggame' activity, Only calling when the answer was wrong.
				if(msnShoppingGamePane.selectedCardIndex != msnShoppingGamePane.c_ai && msnShoppingGamePane.selectedCardIndex > -1){
					msnShoppingGamePane.gameContainerRef.querySelector("fluent-card").parentElement.style = "border:4px solid rgb(0, 174, 86)";
					msnShoppingGamePane.selectedCardIndex = -1;
					msnShoppingGamePane.confettiAnimate.play();
                    await reportActivity();				
                }				
				// Update user points balance.
				if(msnShoppingGamePane.gameState === "win" && showCustomPointsCounter) 
					setTimeout(updateUserPointsBalance, 1200);
				
				// Automatically click 'Play Again'.
				if(autoReplay && msnShoppingGamePane.selectedCardIndex > -1){
					msnShoppingGamePane.selectedCardIndex = -1;
					setTimeout(()=>Array.from(msnShoppingGamePane.gameContainerRef.querySelectorAll("button")).find(e=>e.textContent.toLowerCase().includes("play again"))?.click(), 25);
				}
                return "win";
            }
        };
		setInterval(removeDailyGameLimit, 100);
		incrementGameCounter();
		msnShoppingGamePane.gameState = "active";
	}
    else alert("Unable to locate the shopping game!\nRefresh the page and try again.");
}

// This is the start...
if(validUrlCheck()){
    setTimeout(async () => { await rewardsConnectorAuthCheck() && await setupReportActivityUrl() && modifyGame(); }, 500);
}