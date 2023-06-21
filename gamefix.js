(function () {
    var iterationNumber = 0;
    var selectButton = null;
    var selectExists = null;
    var fixIntervalId;
    
    var msnShoppingGamePane2 = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane");

    var shoppingGame = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane")
        ?.shadowRoot.querySelector("msft-stripe");

    function getObjectIndexFromArray(objects, id) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].id === id) {
                return i
            }
        }
        return -1
    }
    function getLowestPriceItemID(priceMap) {
        var lowestPriceItemID;
        var currLowestPrice = Infinity;
        for (const [itemID, item] of Object.entries(priceMap)) {
            let price = parseFloat(item.price.substring(1));
            if (currLowestPrice > price) {
                lowestPriceItemID = itemID; currLowestPrice = price
            }
        }
        return lowestPriceItemID
    }

    function highlightItems(correctIndex, items) {
        for (let i = 0; i < items.length; i++) {
            if (i == correctIndex) {
                selectButton = shoppingGame.getElementsByClassName("shopping-game-card-outline")[correctIndex]
                    ?.querySelector("fluent-card")
                    ?.querySelector("msn-shopping-card")
                    .getElementsByClassName("shopping-select-overlay-button")[0];
                items[i].style.borderColor = "red";

            }
        }
    }
    function refreshGame() {
        var lowestPriceItemID = getLowestPriceItemID(msnShoppingGamePane2.originalPricesbyId);
        var itemIndex = getObjectIndexFromArray(msnShoppingGamePane2.displayedShoppingEntities, lowestPriceItemID);
        console.log("Coeeect Index: "+itemIndex);
        highlightItems(itemIndex, shoppingGame.getElementsByClassName("shopping-game-card-outline"));
        if (selectButton != null) {
                    console.log("SEL Button received" + selectButton);
                    setTimeout(selectButtonCLick, 1000);
                } else {
                    console.log("Select Button Null");
                }
        const msnShoppingGamePane = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane");
        if (msnShoppingGamePane.getAttribute('gamestate')=='win'||msnShoppingGamePane.getAttribute('gamestate')=='idle') {
            msnShoppingGamePane.setAttribute('gamestate', 'active');
            msnShoppingGamePane.resetGame();
        }
    }
    function selectButtonCLick() {
        console.log("Iteration no: "+iterationNumber)
        selectButton.click();
        iterationNumber++;
        if(iterationNumber===10){
            stopFixExecution();
        }
    }
    refreshGame();
    msnShoppingGamePane2.addEventListener('click', function (event) {
        console.log("MOUSE");
        refreshGame();
    });

    function executeFixFunction() {
        selectExists = document.querySelector("shopping-page-base")
            ?.shadowRoot.querySelector("shopping-homepage")
            ?.shadowRoot.querySelector("msft-feed-layout")
            ?.shadowRoot.querySelector("msn-shopping-game-pane").getAttribute("gamestate");
        console.log("Execute Fix Function: " + selectExists);
        if (selectExists == 'win' || selectExists == 'idle' || selectExists == 'active' || selectExists == 'lose') {
            refreshGame();
        }
    }

    function startFixExecution() {
        console.log("Start Fix Function");
        fixIntervalId = setInterval(function () {
            executeFixFunction();
        }, 1100);
    }
    startFixExecution();
    function stopFixExecution() {
        // Clear the interval
        clearInterval(fixIntervalId);
    }

})();
