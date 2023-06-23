(async function(){
  var iterationNumber = 0;
  var selectButton = null;
  var selectExists = null;
  var scroll = document.querySelector("shopping-page-base")
    ?.shadowRoot.querySelector("shopping-homepage")
    ?.shadowRoot.querySelector("msft-feed-layout")
    ?.shadowRoot.querySelector("msn-shopping-game-pane");

  if (scroll) {
    scroll.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.log("Couldn't Load Game, Reload");
    return;
  }

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
      if (i == correctIndex) {
        selectButton = shoppingGame.getElementsByClassName("shopping-game-card-outline")[correctIndex]
          ?.querySelector("fluent-card")
          ?.querySelector("msn-shopping-card")
          .getElementsByClassName("shopping-select-overlay-button")[0];
        items[i].style.borderColor = "red";
      }
    }
  }

  async function refreshGame() {
    var lowestPriceItemID = await getLowestPriceItemID(msnShoppingGamePane2.originalPricesbyId);
    var itemIndex = await getObjectIndexFromArray(msnShoppingGamePane2.displayedShoppingEntities, lowestPriceItemID);
    console.log("Correct Index: " + itemIndex);
    await highlightItems(itemIndex, shoppingGame.getElementsByClassName("shopping-game-card-outline"));
    if (selectButton != null) {
      console.log("SEL Button received" + selectButton);
      await selectButtonClick();
    } else {
      console.log("Select Button Null");
    }
    const msnShoppingGamePane = document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane");
    if (msnShoppingGamePane.getAttribute('gamestate') == 'win' || msnShoppingGamePane.getAttribute('gamestate') == 'idle' || msnShoppingGamePane.getAttribute('gamestate') == 'lose') {
      msnShoppingGamePane.setAttribute('gamestate', 'active');
      msnShoppingGamePane.resetGame();
    }
  }

  async function selectButtonClick() {
    console.log("Iteration no: " + iterationNumber);
    selectButton.click();
    iterationNumber++;
    if (iterationNumber >= 10) {
      clearInterval(fixIntervalId);
    }
  }

  async function executeFixFunction() {
    selectExists = document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane").getAttribute("gamestate");
    console.log("Execute Fix Function: " + selectExists);
    if (selectExists == 'win' || selectExists == 'idle' || selectExists == 'active' || selectExists == 'lose') {
      await refreshGame();
    }
  }

  async function startFixExecution() {
    console.log("Start Fix Function");
    fixIntervalId = setInterval(async function () {
      await executeFixFunction();
    }, 1100);
  }

  await startFixExecution();
})();