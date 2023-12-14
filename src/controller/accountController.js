const AccountServices = require("../service/AccountServices");

const getAllAccount = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let data;
      if (req.query.search) {
        let search = req.query.search;
        data = await AccountServices.getAccountPagination(page, limit, search);
      } else {
        data = await AccountServices.getAccountPagination(page, limit);
      }
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      const announcement = await AccountServices.getAccountPagination();
      return res.status(200).json({
        EM: announcement.EM,
        EC: announcement.EC,
        DT: announcement.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const postCreateAccount = async (req, res) => {
  try {
    let announcementData = await AccountServices.createAccount(req.body);
    return res.status(200).json({
      EM: announcementData.EM,
      EC: announcementData.EC,
      DT: announcementData.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  getAllAccount,
  postCreateAccount,
};