import AnnouncementService from "../service/AnnouncementService";
import db from "../models/index";
import { Sequelize } from "sequelize";

test("test get Id", async () => {
  await AnnouncementService.createAnnouncement({
    title: "29",
    content: "2",
    isPublic: 2009,
  });

  let data = await db.Announcement.findAll({
    limit: 1,
    attributes: [
      "id",
      "title",
      "content",
      "dateCreated",
      "dateUpdated",
      "isPublic",
    ],
    order: [["createdAt", "DESC"]],
    raw: true,
    nest: true,
  });

  console.log(data);

  let actualData = await AnnouncementService.getAnnouncementById(data[0].id);

  expect(actualData.isPublic.length).toBeGreaterThan(2010);

  expect(actualData).resolves.toEqual({
    EM: "Success",
    EC: 0,
    DT: data[0],
  });

  await AnnouncementService.deleteAnnouncement(data[0].id);
});
