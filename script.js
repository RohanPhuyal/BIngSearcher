(async function () {
    var playAgain = null;
    document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("cs-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane").setAttribute('gamestate', 'active');

    var shoppingGame = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("cs-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane")
        ?.shadowRoot.querySelector("msft-stripe");

    async function executeScript() {
        console.log("Executing");
        var pricesAll = []; // Array to store original prices
        var discountAll = []; // Array to store discounts
        var finalPrice = [];
        var cheapestIndex; // Store the index of the cheapest item


        async function pricesOfAll() {
            var prices = document
                .querySelector("shopping-page-base")
                ?.shadowRoot.querySelector("shopping-homepage")
                ?.shadowRoot.querySelector("cs-feed-layout")
                ?.shadowRoot.querySelector("msn-shopping-game-pane").displayedShoppingEntities;

            var loopTimes = prices.length;
            for (let i = 0; i < loopTimes; i++) {
                pricesAll.push(prices[i].priceInfo.originalPrice); // Add original price to pricesAll array
                discountAll.push(prices[i].dealPercentage); // Add discount to discountAll array
            }
        }

        async function calculateDiscount() {
            for (let i = 0; i < pricesAll.length; i++) {
                let initPrice = parseFloat(pricesAll[i].replace(/[$,]/g, ""));
                let discountPercentage = parseFloat(discountAll[i].replace("%", ""));
                let discountedPrice = (initPrice - ((initPrice * discountPercentage) / 100));
                finalPrice.push(discountedPrice);
            }
        }
        async function findCheapestIndex(finalPrice) {
            var cheapestPrice = Math.min(...finalPrice); // Find the lowest value in the finalPrice array
            var cheapIndex = finalPrice.indexOf(cheapestPrice); // Get the index of the lowest value
            return cheapIndex;
        }

        async function highlightAndRemoveItems(correctIndex, items) {
            for (let i = 0; i < items.length; i++) {
                if (i === correctIndex) {
                    items[i].style.borderColor = "green";
                } else {
                    items[i].style.display = "none";
                }
            }
            pricesAll = [];
            discountAll = [];
            finalPrice = [];
            cheapestIndex = null;

        }
        async function playAgainFunc() {
            // Get the initial shadow DOM element
            const firstShadowRoot = document.querySelector("#root > div > div > fluent-design-system-provider > div > div:nth-child(4) > div > shopping-page-base").shadowRoot;

            // Traverse through the shadow DOM to find the desired elements
            const shoppingHomepage = firstShadowRoot.querySelector("div > div.shopping-page-content > shopping-homepage").shadowRoot;
            const csFeedLayout = shoppingHomepage.querySelector("div > cs-feed-layout").shadowRoot;
            const shoppingGamePane = csFeedLayout.querySelector("msn-shopping-game-pane").shadowRoot;
            const gamePanelContainer = shoppingGamePane.querySelector("div.shopping-game-pane-container > div.game-panel-container > div.game-panel-header-2");
            if(gamePanelContainer){
                // Search for a button with the text "Play Again" within the div
            playAgain = gamePanelContainer.querySelectorAll("button")[0];
            }
            if (playAgain !== null) {
                console.log("Terminating playAgainFunc(): playAgain button found!");
                playAgain.click();
                clearInterval(fixIntervalId);
                playAgain=null;
                setTimeout(async function() {
                    await executeScript();
                  }, 9000); // 5000 milliseconds = 5 seconds
                  
                // setTimeout(() => executeScript(), 9000);
            }
        }
        await pricesOfAll();
        await calculateDiscount();
        cheapestIndex = await findCheapestIndex(finalPrice);
        await highlightAndRemoveItems(cheapestIndex, shoppingGame.getElementsByClassName("shopping-game-card-outline"));
        // Only schedule the setTimeout if playAgain is still null
        var fixIntervalId = setInterval(async function () {
            await playAgainFunc();
        }, 100);
    }
        await executeScript();
})();
