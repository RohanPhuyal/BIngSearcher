 (function()
{
    var selectButton = null;
    var selectExists = null;

    var msnShoppingGamePane2 = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");
    refreshGame();
    function selectButtonCLick(){
        selectButton.click();
    }
    function refreshGame(){
        selectButton = document.querySelector("shopping-page-base")
        ?.shadowRoot.querySelector("shopping-homepage")
        ?.shadowRoot.querySelector("msft-feed-layout")
        ?.shadowRoot.querySelector("msn-shopping-game-pane")
        ?.shadowRoot.querySelector("msft-stripe")
        ?.querySelector("fluent-card")
        ?.querySelector("msn-shopping-card").getElementsByClassName("shopping-select-overlay-button")[0];
        if(msnShoppingGamePane2 != null){
            msnShoppingGamePane2.cardsPerGame = 1;
            msnShoppingGamePane2.setAttribute('gamestate', 'active');
            msnShoppingGamePane2.resetGame();
            if (selectButton) {
                console.log("Select Value Received");
                selectButtonCLick();
              }
            else{
                console.log("Select Value Not Received");
            }
        }else{
            console.error("Unable to locate the shopping game!");
        }
        if(selectButton==null){
            console.log("NULL");
        }else{
            console.log("Not null");
        }
    }
    msnShoppingGamePane2.addEventListener('click', function(event) {
        console.log("MOUSE");
        refreshGame();
        });

        var fixIntervalId;
        function executeFixFunction() {
            selectExists=document.querySelector("shopping-page-base")
            ?.shadowRoot.querySelector("shopping-homepage")
            ?.shadowRoot.querySelector("msft-feed-layout")
            ?.shadowRoot.querySelector("msn-shopping-game-pane").getAttribute("gamestate");
            console.log("Execute Fix Function: "+selectExists);
            if(selectExists=='win'||selectExists=='idle'||selectExists=='active'){
                refreshGame();
            }
        }

        function startFixExecution() {
            console.log("Start Fix Function");
        // executeFixFunction();
        fixIntervalId = setInterval(function () {
            executeFixFunction();
        }, 1500);
        }
        startFixExecution();
        function stopFixExecution() {
            //Not Yet Implemented
            // Clear the interval
            clearInterval(fixIntervalId);
        }
        
})();
