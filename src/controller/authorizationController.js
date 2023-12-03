import AuthorizationService from "../service/AuthorizationService";

const getRole = async (req, res) => {
  try {
    const avResult = await AuthorizationService.getRole(req.body.id);
    if (avResult.EC === 0) {
      const user = { ...avResult.DT };
      return res.status(200).json({
        EM: "Authorized",
        EC: 0,
        DT: { ...user },
      });
    } else return res.status(401).json(avResult);
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  getRole,
};
