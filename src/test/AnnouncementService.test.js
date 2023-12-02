import AnnouncementService from "../service/AnnouncementService";
import db from "../models/index";
import { Sequelize } from "sequelize";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const successAnnouncement = [
  ["Success title 1", "Success content 1", true],
  ["Success title 2", "Success content 2", false],
];

const invalidAnnoucement = [
  [1, "Invalid content 1", true],
  ["Invalid title 2", 1, false],
  ["Invalid title 3", "Invalid content 3", 1],
  [null, "Invalid content 12", false],
  ["Invalid title 13", null, false],
  ["Invalid title 14", "Invalid content 14", null],
];

const unfilledAnnouncement = [
  [undefined, "Unfilled content 1", true],
  ["Unfilled title 2", undefined, false],
  ["Unfilled title 3", "Unfilled content 3", undefined],
  ["", "Unfilled content 8", true],
  ["Unfilled title 9", "", false],
  ["Unfilled title 10", "Unfilled content 10", ""],
];

// Test get announcement list
describe("Test get announcement list", () => {
  it("Get announcement list successfully", async () => {
    await expect(AnnouncementService.getAnnouncementList()).resolves.toEqual({
      EM: "Get announcement list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

// Test get announcement by ID
describe("\nTest get announcement by ID", () => {
  it("Get announcement by ID successfully", async () => {
    await AnnouncementService.createAnnouncement({
      title: "Success title",
      content: "Success content",
      isPublic: true,
    });

    const newData = await db.Announcement.findAll({
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

    await expect(
      AnnouncementService.getAnnouncementById(newData[0].id)
    ).resolves.toEqual({
      EM: "Get announcement by id successfully",
      EC: 0,
      DT: newData[0],
    });

    await AnnouncementService.deleteAnnouncement(newData[0].id);
  });

  it("Announcement not found", async () => {
    await expect(
      AnnouncementService.getAnnouncementById(100000)
    ).resolves.toEqual({
      EM: "Announcement not found",
      EC: 4,
      DT: null,
    });
  });

  it("Invalid announcement id", async () => {
    await expect(
      AnnouncementService.getAnnouncementById("abc")
    ).resolves.toEqual({
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    });
  });
});

// Test get announcement pagination
describe("\nTest get announcement pagination", () => {
  it("Get announcement pagination successfully", async () => {
    await expect(
      AnnouncementService.getAnnouncementPagination(1, 10)
    ).resolves.toEqual({
      EM: "Get announcement pagination successfully",
      EC: 0,
      DT: expect.objectContaining({
        announcements: expect.any(Array),
        totalPage: expect.any(Number),
        totalRows: expect.any(Number),
      }),
    });
  });
});

// Test create announcement
describe("\nTest create Announcement", () => {
  //Test success case
  test.each(successAnnouncement)(
    "Title: %s, Content: %s, isPublic: %s (Create announcement successfully)",
    async (title, content, isPublic) => {
      const data = await AnnouncementService.createAnnouncement({
        title: title,
        content: content,
        isPublic: isPublic,
      });

      expect(data).toEqual({
        EM: "New announcement created successfully",
        EC: 0,
        DT: "",
      });

      const newData = await db.Announcement.findAll({
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

      await AnnouncementService.deleteAnnouncement(newData[0].id);
    }
  );

  // Test invalid case
  test.each(invalidAnnoucement)(
    "Title: %s, Content: %s, isPublic: %s (Announcement information is invalid)",
    async (title, content, isPublic) => {
      await expect(
        AnnouncementService.createAnnouncement({
          title: title,
          content: content,
          isPublic: isPublic,
        })
      ).resolves.toEqual({
        EM: "Announcement information is invalid",
        EC: 3,
        DT: "",
      });
    }
  );

  // Test unfilled case
  test.each(unfilledAnnouncement)(
    "Title: %s, Content: %s, isPublic: %s (Announcement information must not be empty)",
    async (title, content, isPublic) => {
      await expect(
        AnnouncementService.createAnnouncement({
          title: title,
          content: content,
          isPublic: isPublic,
        })
      ).resolves.toEqual({
        EM: "Announcement information must not be empty",
        EC: 2,
        DT: "",
      });
    }
  );
});

// Test delete announcement
describe("\nTest update Announcement", () => {
  test.each(successAnnouncement)(
    "Title: %s, Content: %s, isPublic: %s (Update announcement successfully)",
    async (title, content, isPublic) => {
      await AnnouncementService.createAnnouncement({
        title: "Test update title",
        content: "Test update content",
        isPublic: true,
      });

      const newData = await db.Announcement.findAll({
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

      await expect(
        AnnouncementService.updateAnnouncement(
          {
            title: title,
            content: content,
            isPublic: isPublic,
          },
          newData[0].id
        )
      ).resolves.toEqual({
        EM: "Update announcement successfully",
        EC: 0,
        DT: "",
      });

      await AnnouncementService.deleteAnnouncement(newData[0].id);
    }
  );

  test.each(unfilledAnnouncement)(
    "Title: %s, Content: %s, isPublic: %s (Announcement information must not be empty)",
    async (title, content, isPublic) => {
      await AnnouncementService.createAnnouncement({
        title: "Test update title",
        content: "Test update content",
        isPublic: true,
      });

      const newData = await db.Announcement.findAll({
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

      await expect(
        AnnouncementService.updateAnnouncement(
          {
            title: title,
            content: content,
            isPublic: isPublic,
          },
          newData[0].id
        )
      ).resolves.toEqual({
        EM: "Announcement information must not be empty",
        EC: 2,
        DT: "",
      });

      await AnnouncementService.deleteAnnouncement(newData[0].id);
    }
  );

  test.each(invalidAnnoucement)(
    "Title: %s, Content: %s, isPublic: %s (Announcement information is invalid)",
    async (title, content, isPublic) => {
      await AnnouncementService.createAnnouncement({
        title: "Test update title",
        content: "Test update content",
        isPublic: true,
      });

      const newData = await db.Announcement.findAll({
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

      await expect(
        AnnouncementService.updateAnnouncement(
          {
            title: title,
            content: content,
            isPublic: isPublic,
          },
          newData[0].id
        )
      ).resolves.toEqual({
        EM: "Announcement information is invalid",
        EC: 3,
        DT: "",
      });

      await AnnouncementService.deleteAnnouncement(newData[0].id);
    }
  );

  it("Announcement not found", async () => {
    await expect(
      AnnouncementService.updateAnnouncement(
        {
          title: "Test update title",
          content: "Test update content",
          isPublic: true,
        },
        100000
      )
    ).resolves.toEqual({
      EM: "Announcement not found",
      EC: 4,
      DT: "",
    });
  });

  it("Invalid announcement id", async () => {
    await expect(
      AnnouncementService.updateAnnouncement(
        {
          title: "Test update title",
          content: "Test update content",
          isPublic: true,
        },
        "abc"
      )
    ).resolves.toEqual({
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    });
  });
});

describe("\nTest delete Announcement", () => {
  it("Delete announcement successfully", async () => {
    await AnnouncementService.createAnnouncement({
      title: "Test delete title",
      content: "Test delete content",
      isPublic: true,
    });

    const newData = await db.Announcement.findAll({
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

    await expect(
      AnnouncementService.deleteAnnouncement(newData[0].id)
    ).resolves.toEqual({
      EM: "Delete announcement successfully",
      EC: 0,
      DT: "",
    });
  });

  it("Announcement not found", async () => {
    await expect(
      AnnouncementService.deleteAnnouncement(100000)
    ).resolves.toEqual({
      EM: "Announcement not found",
      EC: 4,
      DT: "",
    });
  });

  it("Invalid announcement id", async () => {
    await expect(
      AnnouncementService.deleteAnnouncement("abc")
    ).resolves.toEqual({
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    });
  });
});
