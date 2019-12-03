const { expect } = require("../chai");
const sinon = require("sinon");

const utilities = require("../../main/utilities");

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

describe("Utilites", () => {
  describe("randomSelect", () => {
    // this is ran after each unit test
    afterEach(() => {
      // this is needed to restore the CoursePortfolio model back to it's original state
      // we don't want to break all future unit tests
      sandbox.restore();
    });

    it("returns an array of specified size", async () => {
      const items = ["apple", "orange", "strawberry", "kiwi", "watermelon"];
      const numberItems = 3;

      const randomItems = utilities.randomSelect(items, numberItems);

      expect(randomItems.length).to.equal(numberItems);
    });

    it("randomizes results", async () => {
      const items = ["apple", "orange", "strawberry", "kiwi", "watermelon"];
      const numberItems = 3;

      const randomItems1 = utilities.randomSelect(items, numberItems);
      const randomItems2 = utilities.randomSelect(items, numberItems);

      expect(randomItems1).not.to.equal(randomItems2);
    });
  });
});
