import db from "../models/index";

const getAnnouncementList = async () => {
  console.log("im");
  try {
    let projectList = await db.Announcement.findAll({
      attributes: [
        "id",
        "title",
        "content",
        "dateCreated",
        "dateUpdated",
        "isPublic",
      ],
      raw: true,
      nest: true,
    });
    return {
      EM: "Success",
      EC: 0,
      DT: projectList,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

module.exports = { getAnnouncementList };
