import AnnouncementService from "../service/AnnouncementService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const successAnnouncement = [["Title", "Content", true]];

const invalidAnnoucement = [
  [1, "Content", true],
  ["Title", 1, true],
  ["Title", "Content", 5],
  ["", "Content", true],
  ["Title", "", true],
];

const invalidId = ["abc", 0];

// Test get announcement list
describe("Test getAnnouncementList", () => {
  // Test success case
  it("Get announcement list successfully", async () => {
    await expect(AnnouncementService.getAnnouncementList()).resolves.toEqual({
      EM: "Get announcement list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

// Test get announcement by ID
describe("\nTest getAnnouncementByID", () => {
  // Test success case
  it("Get announcement by ID successfully", async () => {
    await AnnouncementService.createAnnouncement({
      title: "Title",
      content: "Content",
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

    await AnnouncementService.deleteAnnouncement([newData[0].id]);
  });

  // Test not found case
  it("Announcement not found", async () => {
    await expect(
      AnnouncementService.getAnnouncementById(100000)
    ).resolves.toEqual({
      EM: "Announcement not found",
      EC: 4,
      DT: null,
    });
  });

  // Test invalid id case
  test.each(invalidId)("ID: %s (Invalid announcement id)", async (id) => {
    await expect(AnnouncementService.getAnnouncementById(id)).resolves.toEqual({
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    });
  });
});

// Test get announcement pagination
describe("\nTest get announcement pagination", () => {
  // Test success case
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
describe("\nTest createAnnouncement", () => {
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
        attributes: ["id"],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
      });

      await AnnouncementService.deleteAnnouncement([newData[0].id]);
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
});

// Test update announcement
describe("\nTest updateAnnouncement", () => {
  // Test success case
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
        attributes: ["id"],
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

      await AnnouncementService.deleteAnnouncement([newData[0].id]);
    }
  );

  // Test invalid announcement information case
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
        attributes: ["id"],
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

      await AnnouncementService.deleteAnnouncement([newData[0].id]);
    }
  );

  // Test not found case
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

  // Test invalid id case
  test.each(invalidId)("ID: %s (Invalid announcement id)", async (id) => {
    await expect(
      AnnouncementService.updateAnnouncement(
        {
          title: "Test update title",
          content: "Test update content",
          isPublic: true,
        },
        id
      )
    ).resolves.toEqual({
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    });
  });
});

// Test delete announcement
describe("\nTest deleteAnnouncement", () => {
  // Test success case
  it("Delete announcement successfully", async () => {
    await AnnouncementService.createAnnouncement({
      title: "Test delete title",
      content: "Test delete content",
      isPublic: true,
    });

    const newData = await db.Announcement.findAll({
      limit: 1,
      attributes: ["id"],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    await expect(
      AnnouncementService.deleteAnnouncement([newData[0].id])
    ).resolves.toEqual({
      EM: "Delete announcement successfully",
      EC: 0,
      DT: "",
    });
  });

  // Test id list empty case
  it("Announcement id list is empty", async () => {
    await expect(AnnouncementService.deleteAnnouncement([])).resolves.toEqual({
      EM: "Announcement id list must not be empty",
      EC: 5,
      DT: "",
    });
  });

  // Test invalid id case
  it("Invalid announcement id", async () => {
    await expect(
      AnnouncementService.deleteAnnouncement([1, 2, "abc"])
    ).resolves.toEqual({
      EM: "Invalid announcement id",
      EC: 1,
      DT: "",
    });
  });
});

// Test server error case with each function
describe("\nTest server error case", () => {
  // Server error case with getAnnouncementList function
  it("Server error case with getAnnouncementList function", async () => {
    await db.sequelize.close();
    await expect(AnnouncementService.getAnnouncementList()).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  // Server error case with getAnnouncementById function
  it("Server error case with getAnnouncementById function", async () => {
    await db.sequelize.close();
    await expect(AnnouncementService.getAnnouncementById(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  // Server error case with getAnnouncementPagination function
  it("Server error case with getAnnouncementPagination function", async () => {
    await db.sequelize.close();
    await expect(
      AnnouncementService.getAnnouncementPagination(1, 10)
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  // Server error case with createAnnouncement function
  it("Server error case with createAnnouncement function", async () => {
    await db.sequelize.close();
    await expect(
      AnnouncementService.createAnnouncement({
        title: "Title",
        content: "Content",
        isPublic: true,
      })
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  // Server error case with updateAnnouncement function
  it("Server error case with updateAnnouncement function", async () => {
    await db.sequelize.close();
    await expect(
      AnnouncementService.updateAnnouncement(
        {
          title: "Title",
          content: "Content",
          isPublic: true,
        },
        1
      )
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  // Server error case with deleteAnnouncement function
  it("Server error case with deleteAnnouncement function", async () => {
    await db.sequelize.close();
    await expect(AnnouncementService.deleteAnnouncement([1])).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
