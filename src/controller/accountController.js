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
      const account = await AccountServices.getAccountPagination();
      return res.status(200).json({
        EM: account.EM,
        EC: account.EC,
        DT: account.DT,
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

const getAccountById = async (req, res) => {
  try {
    let data = await AccountServices.getAccountById(+req.query.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
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
    let data = await AccountServices.createAccount(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const putUpdateAccount = async (req, res) => {
  try {
    let data = await AccountServices.updateAccount(+req.params.id, req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const handleDeleteAccount = async (req, res) => {
  try {
    let deleteAccount = await AccountServices.deleteAccount(
      req.body.accountIds
    );
    return res.status(200).json({
      EM: deleteAccount.EM,
      EC: deleteAccount.EC,
      DT: deleteAccount.DT,
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
  getAccountById,
  postCreateAccount,
  putUpdateAccount,
  handleDeleteAccount,
};
