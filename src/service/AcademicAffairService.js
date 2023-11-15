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
  aa = aa.get({ plain: true });
  //console.log(aa);
  return aa;
};

const getAAList = async (Simplyfy = false) => {
  let aaList = await db.AcademicAffair.findAll();
  if (Simplyfy) {
    aaList = aaList.map((value) => value.dataValues);
  }
  //console.log(aaList);
  return aaList;
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

const deleteAA = async (id) => {
  db.AcademicAffair.destroy({
    where: { id: id },
  });
};

module.exports = {
  createAA,
  getAAById,
  getAAList,
  updateAA,
  deleteAA,
};
