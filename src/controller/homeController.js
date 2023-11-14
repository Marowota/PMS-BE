const aaService = require("../service/AcademicAffairService");

const testAA = () => {
  aaService.getAAList();
};

module.exports = {
  testAA,
};
