import AnnouncementService from "../service/AnnouncementService";

const getAllAnnouncement = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let data = await AnnouncementService.getAnnouncementPagination(
        page,
        limit
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      const announcement = await AnnouncementService.getAnnouncementList();
      return res.status(200).json({
        EM: announcement.EM,
        EC: announcement.EC,
        DT: announcement.DT,
      });
    }
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = { getAllAnnouncement };
