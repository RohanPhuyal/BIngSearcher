(async function () {
    var scroll= document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane");

    if (scroll) {
        scroll.scrollIntoView({behavior: 'smooth'});
    } else {
        alert("Couldn't Load Game, Reload");
        return;
    }
    var selectButton = null;
    var selectExists = null;
    var iterationNumber = 0;
    var msnShoppingGamePane2 = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane");

    var shoppingGame = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane")
        ?.shadowRoot.querySelector("msft-stripe");

    async function getObjectIndexFromArray(objects, id) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    async function getLowestPriceItemID(priceMap) {
        var lowestPriceItemID;
        var currLowestPrice = Infinity;
        for (const [itemID, item] of Object.entries(priceMap)) {
            let price = parseFloat(item.price.substring(1));
            if (currLowestPrice > price) {
                lowestPriceItemID = itemID;
                currLowestPrice = price;
            }
        }
        return lowestPriceItemID;
    }

    async function highlightItems(correctIndex, items) {
        for (let i = 0; i < items.length; i++) {
            if (i === correctIndex) {
                selectButton = shoppingGame.getElementsByClassName("shopping-game-card-outline")[correctIndex]
                    ?.querySelector("fluent-card")
                    ?.querySelector("msn-shopping-card")
                    .getElementsByClassName("shopping-select-overlay-button")[0];
                items[i].style.borderColor = "red";
            } else {
                items[i].style.borderColor = "";
                items[i].style.display = "none";
            }
        }
    }

    async function refreshGame() {
        var lowestPriceItemID = await getLowestPriceItemID(msnShoppingGamePane2.originalPricesbyId);
        var itemIndex = await getObjectIndexFromArray(msnShoppingGamePane2.displayedShoppingEntities, lowestPriceItemID);
        console.log("Coeeect Index: " + itemIndex);
        await highlightItems(itemIndex, shoppingGame.getElementsByClassName("shopping-game-card-outline"));
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
        if (msnShoppingGamePane.getAttribute('gamestate') === 'idle') {
            msnShoppingGamePane.setAttribute('gamestate', 'active');
            msnShoppingGamePane.resetGame();
        }
    }

    async function reloadGame() {
        const msnShoppingGamePane = document.querySelector("shopping-page-base")
            ?.shadowRoot.querySelector("shopping-homepage")
            ?.shadowRoot.querySelector("msft-feed-layout")
            ?.shadowRoot.querySelector("msn-shopping-game-pane");
        if (msnShoppingGamePane.getAttribute('gamestate') === 'win' || msnShoppingGamePane.getAttribute('gamestate') === 'idle' || msnShoppingGamePane.getAttribute('gamestate') === 'lose') {
            msnShoppingGamePane.setAttribute('gamestate', 'active');
            msnShoppingGamePane.resetGame();
            console.log("Iteration Number: " + iterationNumber);
            iterationNumber++;
        }

        if (iterationNumber >= 10) {
            clearInterval(fixIntervalId);
        }
    }

    async function selectButtonCLick() {
        // setTimeout(reloadGame, 1000);
        await reloadGame();
    }

    await refreshGame();
    msnShoppingGamePane2.addEventListener('click', function (event) {
        console.log("MOUSE");
        refreshGame();
    });

    var fixIntervalId;

    async function executeFixFunction() {
        selectExists = document.querySelector("shopping-page-base")
            ?.shadowRoot.querySelector("shopping-homepage")
            ?.shadowRoot.querySelector("msft-feed-layout")
            ?.shadowRoot.querySelector("msn-shopping-game-pane").getAttribute("gamestate");
        console.log("Execute Fix Function: " + selectExists);
        if (selectExists === 'win' || selectExists === 'idle' || selectExists === 'active' || selectExists === 'lose') {
            refreshGame();
        }
    }

    async function startFixExecution() {
        console.log("Start Fix Function");
        fixIntervalId = setInterval(async function () {
            await executeFixFunction();
        }, 500);
    }

    await startFixExecution();
})();
