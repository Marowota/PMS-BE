import db from "../models/index";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
const getAnnouncementList = async () => {
  try {
    let announcementList = await db.Announcement.findAll({
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
      order: [["id", "DESC"]],
    });
    return {
      EM: "Get announcement list successfully",
      EC: 0,
      DT: announcementList,
    };
  } catch (error) {
    return {
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    };
  }
};

const getAnnouncementById = async (id) => {
  if (typeof id !== "number" || id < 1)
    return {
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    };
  else {
    try {
      let announcement = await db.Announcement.findOne({
        where: { id: id },
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

      if (announcement === null) {
        return {
          EM: "Announcement not found",
          EC: 4,
          DT: null,
        };
      } else {
        return {
          EM: "Get announcement by id successfully",
          EC: 0,
          DT: announcement,
        };
      }
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const getAnnouncementPagination = async (page, limit, search = "") => {
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
      where: {
        title: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("title")),
          "LIKE",
          "%" + search + "%"
        ),
      },
      raw: true,
      nest: true,
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    let totalPage = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPage,
      announcements: rows,
    };

    return {
      EM: "Get announcement pagination successfully",
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
  if (
    typeof rawData.title !== "string" ||
    typeof rawData.content !== "string" ||
    typeof rawData.isPublic !== "boolean" ||
    rawData.title === "" ||
    rawData.content === ""
  )
    return {
      EM: "Announcement information is invalid",
      EC: 3,
      DT: "",
    };
  else {
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
  }
};

const updateAnnouncement = async (announcement, announcementId) => {
  if (
    typeof announcement.title !== "string" ||
    typeof announcement.content !== "string" ||
    typeof announcement.isPublic !== "boolean" ||
    announcement.title === "" ||
    announcement.content === ""
  )
    return {
      EM: "Announcement information is invalid",
      EC: 3,
      DT: "",
    };
  else if (typeof announcementId !== "number" || announcementId < 1)
    return {
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    };
  else {
    try {
      const Announcement = await db.Announcement.findOne({
        where: { id: announcementId },
      });
      const currentTime = new Date();
      if (Announcement) {
        await Announcement.update({
          title: announcement.title,
          content: announcement.content,
          isPublic: announcement.isPublic,
          dateUpdated: currentTime,
        });

        return {
          EM: "Update announcement successfully",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Announcement not found",
          EC: 4,
          DT: "",
        };
      }
    } catch (error) {
      return {
        EM: "There are something wrong in the server's services",
        EC: -1,
        DT: "",
      };
    }
  }
};

const deleteAnnouncement = async (announcementIds) => {
  let check = 0;
  announcementIds.forEach((id) => {
    if (typeof id !== "number" || id < 1) check += 1;
  });
  if (announcementIds.length === 0) {
    return {
      EM: "Announcement id list must not be empty",
      EC: 5,
      DT: "",
    };
  } else if (check !== 0) {
    return {
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    };
  } else {
    try {
      await db.Announcement.destroy({
        where: {
          id: { [Op.in]: announcementIds },
        },
      });
      return {
        EM: "Delete announcement successfully",
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
  }
};

module.exports = {
  getAnnouncementList,
  getAnnouncementPagination,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
};
