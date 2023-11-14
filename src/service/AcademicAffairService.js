const db = require("../models/index");

const createAA = async (aacode, faculty, position) => {
  await db.AcademicAffair.create({
    academicAffairCode: aacode,
    faculty: faculty,
    position: position,
  });
};

const getAAById = async (id) => {
  let aa = {};
  aa = await db.AcademicAffair.findOne({
    where: { id: id },
  });
  return (aa = aa.get({ plain: true }));
};

const updateAA = async (id, aacode, faculty, position) => {
  let currentAA = getAAById(id);
  await db.AcademicAffair.update(
    {
      academicAffairCode: aacode ?? currentAA.academicAffairCode,
      faculty: faculty ?? currentAA.faculty,
      position: position ?? currentAA.position,
    },
    {
      where: { id: id },
    }
  );
};

const getAAList = async () => {
  let aaList = await db.AcademicAffair.findAll();
  console.log(aaList);
};

module.exports = {
  createAA,
  getAAById,
  getAAList,
  updateAA,
};
