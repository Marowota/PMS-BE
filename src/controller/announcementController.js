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

const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await AnnouncementService.getAnnouncementById(
      +req.query.id
    );
    return res.status(200).json({
      EM: announcement.EM,
      EC: announcement.EC,
      DT: announcement.DT,
    });
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

const putUpdateAnnouncement = async (req, res) => {
  try {
    let updateInfo = await AnnouncementService.updateAnnouncement(
      {
        title: req.body.title,
        content: req.body.content,
        isPublic: Boolean(req.body.isPublic),
      },
      +req.params.id
    );
    return res.status(200).json({
      EM: updateInfo.EM,
      EC: updateInfo.EC,
      DT: updateInfo.DT,
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
    const annoucementIDs = req.body.ids;
    annoucementIDs.forEach((id) => {
      id = parseInt(id);
    });
    let deleteInfo = await AnnouncementService.deleteAnnouncement(
      annoucementIDs
    );
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
  getAnnouncementById,
  putUpdateAnnouncement,
};
