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

const getAnnouncementPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Announcement.findAndCountAll({
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
      offset: offset,
      limit: limit,
    });

    let totalPage = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPage,
      announcements: rows,
    };

    return {
      EM: "Get data successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const createAnnouncement = async (rawData) => {
  try {
    const currentTime = new Date();
    await db.Announcement.create({
      title: rawData.title,
      content: rawData.content,
      isPublic: rawData.isPublic,
      dateCreated: currentTime,
      dateUpdated: currentTime,
    });

    return {
      EM: "New announcement created successfully",
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
};

module.exports = {
  getAnnouncementList,
  getAnnouncementPagination,
  createAnnouncement,
};
