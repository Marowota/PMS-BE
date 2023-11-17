import AnnouncementService from "../service/AnnouncementService";

const getAllAnnouncement = async (req, res) => {
  try {
    const announcement = await AnnouncementService.getAnnouncementList();
    console.log(">>> check announcement:", announcement);
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

module.exports = { getAllAnnouncement };
