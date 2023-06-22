(function () {
    var scroll= document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane");

      if(scroll){
        scroll.scrollIntoView({behavior: 'smooth'});
      }else{
        alert("Couldn't Load Game, Reload");
		return;
      }
    var selectButton = null;
    var selectExists = null;
    var iterationNumber=0;
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
            else {
                items[i].style.borderColor = ""; items[i].style.display = "none"; 
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
                if (msnShoppingGamePane2.getAttribute('gamestate')=='idle'){
                    msnShoppingGamePane2.setAttribute('gamestate', 'active');
                     msnShoppingGamePane2.resetGame();
                }
        
    }
    function reloadGame(){
        const msnShoppingGamePane = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane");
        if (msnShoppingGamePane.getAttribute('gamestate')=='win'||msnShoppingGamePane.getAttribute('gamestate')=='idle'||msnShoppingGamePane.getAttribute('gamestate')=='lose') {
            msnShoppingGamePane.setAttribute('gamestate', 'active');
            msnShoppingGamePane.resetGame();
            console.log("Iteration Number: "+iterationNumber);
            iterationNumber++;
        }
        
        if(iterationNumber>=10){
            clearInterval(fixIntervalId);
        }
    }
    function selectButtonCLick() {
        setTimeout(reloadGame, 1000);
    }
    refreshGame();
    msnShoppingGamePane2.addEventListener('click', function (event) {
        console.log("MOUSE");
        refreshGame();
    });

    var fixIntervalId;
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
        }, 1000);
    }
    startFixExecution();
})();