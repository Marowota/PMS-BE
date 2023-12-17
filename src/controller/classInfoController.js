const ClassInfoService = require("../service/ClassInfoService");

const getAllClass = async (req, res) => {
  try {
    const result = await ClassInfoService.getAllClass();
    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const postNewClass = async (req, res) => {
  try {
    console.log(req.body);
    const result = await ClassInfoService.addNewClass(req.body);
    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const handleDeleteClass = async (req, res) => {
  try {
    const classIDs = req.body.ids;
    classIDs.forEach((id, i, arr) => {
      arr[i] = parseInt(id);
    });
    let deleteInfo = await ClassInfoService.deleteClassService(classIDs);
    console.log(deleteInfo);
    return res.status(200).json({
      EM: deleteInfo.EM,
      EC: deleteInfo.EC,
      DT: deleteInfo.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = { getAllClass, postNewClass, handleDeleteClass };
