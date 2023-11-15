const aaService = require("../service/AcademicAffairService");

const testAA = () => {
  aaService.getAAById(129);
  aaService.getAAList(true);
};

module.exports = {
  testAA,
};
