const Course = require("../../../main/models/Course");
const CourseRoute = require("../../../main/routes/course");
const { expect } = require("../../chai");

describe("Model - Course", () => {
  describe("lookup", () => {
    it("with id", async () => {
      const slo = await Course.query().findById(1);
      console.log(slo);
      expect(slo.id).to.equal(1);
      expect(slo.department_id).to.equal(1);
      expect(slo.number).to.equal(498);
      expect(slo.end_date).to.equal("2019-12-05");
    });
  });

  describe("relations", () => {
    it("has owner set", async () => {
      const course = await Course.query().findById(1);
      const department = await course.$relatedQuery("department");

      expect(department).to.deep.equal({
        id: 1,
        identifier: "cs",
        name: "Computer Science"
      });
    });
  });
});

describe("Route - Course", () => {
  it("calculates inactive date", async () => {
    const end_date = await CourseRoute.end_date(1); // Act
    const inactive_date = new Date("2019-12-20").toString(); // Arrange
    expect(end_date).to.equal(inactive_date); // Assert
  });
});
