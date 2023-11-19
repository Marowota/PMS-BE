import AnnouncementService from "../service/AnnouncementService";

const getAllAnnouncement = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let data;
      if (req.query.search) {
        let search = req.query.search;
        data = await AnnouncementService.getAnnouncementPagination(
          page,
          limit,
          search
        );
      } else {
        data = await AnnouncementService.getAnnouncementPagination(page, limit);
      }
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

const postCreateAnnouncement = async (req, res) => {
  try {
    let announcementData = await AnnouncementService.createAnnouncement(
      req.body
    );
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

const handleDeleteAnnouncement = async (req, res) => {
  try {
    console.log(">>> req.body", req.body);
    let deleteInfo = await AnnouncementService.deleteAnnouncement(req.body.ids);
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

module.exports = {
  getAllAnnouncement,
  postCreateAnnouncement,
  handleDeleteAnnouncement,
};
