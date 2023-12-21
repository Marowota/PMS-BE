const db = require("../models/index");

const createAA = async (aacode, faculty, position, userID) => {
  if (
    typeof aacode !== "string" ||
    typeof faculty !== "string" ||
    typeof userID !== "number" ||
    faculty.length === 0 ||
    aacode.length === 0 ||
    userID <= 0
  ) {
    return {
      EM: "Invalid academic affair information",
      EC: 9,
      DT: "",
    };
  } else {
    try {
      await db.AcademicAffair.create({
        academicAffairCode: aacode,
        faculty: faculty,
        position: position,
        userID: userID,
      });
      return {
        EM: "Create academic affair successfully",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const getAAById = async (id) => {
  if (typeof id !== "number" || id <= 0) {
    return {
      EM: "Academic affair id is invalid",
      EC: 10,
      DT: "",
    };
  } else {
    try {
      let aa = await db.AcademicAffair.findOne({
        where: { id: id },
        attributes: ["id", "academicAffairCode", "faculty", "userID"],
        nest: true,
        raw: true,
      });
      if (aa === null) {
        return {
          EM: "Academic affair not found",
          EC: 11,
          DT: "",
        };
      } else {
        return {
          EM: "Get academic affair by id successfully",
          EC: 0,
          DT: aa,
        };
      }
    } catch (error) {
      console.log("Error: ", error);
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const getAAList = async () => {
  try {
    let aaList = await db.AcademicAffair.findAll({
      attributes: ["id", "academicAffairCode", "faculty", "userID"],
      raw: true,
      nest: true,
    });

    return {
      EM: "Get academic affair list successfully",
      EC: 0,
      DT: aaList,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const updateAA = async (id, aacode, faculty, position, userID) => {
  if (typeof id !== "number" || id <= 0) {
    return {
      EM: "Academic affair id is invalid",
      EC: 10,
      DT: "",
    };
  } else if (
    typeof aacode !== "string" ||
    typeof faculty !== "string" ||
    typeof userID !== "number" ||
    faculty.length === 0 ||
    aacode.length === 0 ||
    userID <= 0
  ) {
    return {
      EM: "Invalid academic affair information",
      EC: 9,
      DT: "",
    };
  } else {
    try {
      const aa = await db.AcademicAffair.findOne({
        where: { id: id },
      });
      if (aa === null) {
        return {
          EM: "Academic affair not found",
          EC: 11,
          DT: "",
        };
      } else {
        await aa.update({
          aacode: aacode,
          faculty: faculty,
          position: position,
        });
        return {
          EM: "Update academic affair successfully",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const deleteAA = async (id) => {
  if (typeof id !== "number" || id <= 0) {
    return {
      EM: "Academic affair id is invalid",
      EC: 10,
      DT: "",
    };
  } else {
    try {
      await db.AcademicAffair.destroy({
        where: { id: id },
      });
      return {
        EM: "Delete academic affair successfully",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

module.exports = {
  createAA,
  getAAById,
  getAAList,
  updateAA,
  deleteAA,
};
