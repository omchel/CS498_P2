const utilities = {
  randomSelect: (items, numItems) => {
    var randomItems = [];
    while (randomItems.length !== numItems) {
      randomIndex = Math.floor(Math.random() * items.length);
      randomItems.push(items[randomIndex]);
      items.splice(randomIndex, 1);
    }
    return randomItems;
  }
};

module.exports = utilities;
