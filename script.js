(function () {
    var msnShoppingGamePane = document.querySelector("shopping-page-base")
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
               items[i].style.borderColor = "red";
            } else {
                items[i].style.borderColor = ""; items[i].style.display = "none"; 
               } 
           } 
       }
        var lowestPriceItemID = getLowestPriceItemID(msnShoppingGamePane.originalPricesbyId); 
        var itemIndex = getObjectIndexFromArray(msnShoppingGamePane.displayedShoppingEntities, lowestPriceItemID);
         highlightItems(itemIndex, shoppingGame.getElementsByClassName("shopping-game-card-outline")) 
       })();