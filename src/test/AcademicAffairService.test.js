import AcademicAffairService from "../service/AcademicAffairService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const successCase = [["AA001", "FIT", 1]];

const invalidCase = [
  [1, "FIT", 1],
  ["", "FIT", 1],
  ["AA001", 1, 1],
  ["AA001", "", 1],
  ["AA001", "FIT", "abc"],
  ["AA001", "FIT", 0],
];

const invalidAAID = [0, "abc"];

// Test create academic affair
describe("Test createAA", () => {
  // Test success case
  test.each(successCase)(
    "Success create academic affair with aacode = %p, faculty = %p, userID = %p",
    async (aacode, faculty, userID) => {
      const result = await AcademicAffairService.createAA(
        aacode,
        faculty,
        userID
      );
      expect(result).toEqual({
        EM: "Create academic affair successfully",
        EC: 0,
        DT: "",
      });

      const newAA = await db.AcademicAffair.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
        nest: true,
        raw: true,
        attributes: ["id"],
      });

      await AcademicAffairService.deleteAA(newAA[0].id);
    }
  );

  // Test invalid case
  test.each(invalidCase)(
    "Invalid academic affair information with aacode = %p, faculty = %p, userID = %p",
    async (aacode, faculty, userID) => {
      const result = await AcademicAffairService.createAA(
        aacode,
        faculty,
        userID
      );
      expect(result).toEqual({
        EM: "Invalid academic affair information",
        EC: 9,
        DT: "",
      });
    }
  );
});

// Test get academic affair by id
describe("\nTest getAAByID", () => {
  // Test success case
  it("Get academic affair by id successfully", async () => {
    await AcademicAffairService.createAA("AA001", "FIT", 1);

    const newAA = await db.AcademicAffair.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      nest: true,
      raw: true,
      attributes: ["id", "academicAffairCode", "faculty", "userID"],
    });

    await expect(AcademicAffairService.getAAById(newAA[0].id)).resolves.toEqual(
      {
        EM: "Get academic affair by id successfully",
        EC: 0,
        DT: newAA[0],
      }
    );

    await AcademicAffairService.deleteAA(newAA[0].id);
  });

  // Test not found case
  it("Academic affair not found", async () => {
    await expect(AcademicAffairService.getAAById(100000)).resolves.toEqual({
      EM: "Academic affair not found",
      EC: 11,
      DT: "",
    });
  });

  // Test invalid id case
  test.each(invalidAAID)(
    "Invalid academic affair id with id = %p",
    async (id) => {
      await expect(AcademicAffairService.getAAById(id)).resolves.toEqual({
        EM: "Academic affair id is invalid",
        EC: 10,
        DT: "",
      });
    }
  );
});

// Test get academic affair list
describe("\nTest getAAList", () => {
  it("Get academic affair list successfully", async () => {
    await expect(AcademicAffairService.getAAList()).resolves.toEqual({
      EM: "Get academic affair list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

// Test update academic affair
describe("\nTest updateAA", () => {
  // Test success case
  test.each(successCase)(
    "Success update academic affair with aacode = %p, faculty = %p, userID = %p",
    async (aacode, faculty, userID) => {
      await AcademicAffairService.createAA("AA001", "FIT", 1);

      const newAA = await db.AcademicAffair.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
        nest: true,
        raw: true,
        attributes: ["id"],
      });

      const result = await AcademicAffairService.updateAA(
        newAA[0].id,
        aacode,
        faculty,
        userID
      );
      expect(result).toEqual({
        EM: "Update academic affair successfully",
        EC: 0,
        DT: "",
      });

      await AcademicAffairService.deleteAA(newAA[0].id);
    }
  );

  // Test invalid case
  test.each(invalidCase)(
    "Invalid academic affair information with aacode = %p, faculty = %p, userID = %p",
    async (aacode, faculty, userID) => {
      await AcademicAffairService.createAA("AA001", "FIT", 1);

      const newAA = await db.AcademicAffair.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
        nest: true,
        raw: true,
        attributes: ["id"],
      });

      await expect(
        AcademicAffairService.updateAA(newAA[0].id, aacode, faculty, userID)
      ).resolves.toEqual({
        EM: "Invalid academic affair information",
        EC: 9,
        DT: "",
      });

      await AcademicAffairService.deleteAA(newAA[0].id);
    }
  );

  // Test not found case
  it("Academic affair not found", async () => {
    expect(
      AcademicAffairService.updateAA(100000, "AA001", "FIT", 1)
    ).resolves.toEqual({
      EM: "Academic affair not found",
      EC: 11,
      DT: "",
    });
  });

  // Test invalid id case
  test.each(invalidAAID)(
    "Invalid academic affair id with id = %p",
    async (id) => {
      await expect(
        AcademicAffairService.updateAA(id, "AA001", "FIT", 1)
      ).resolves.toEqual({
        EM: "Academic affair id is invalid",
        EC: 10,
        DT: "",
      });
    }
  );
});

// Test delete academic affair
describe("\nTest deleteAA", () => {
  // Test success case
  it("Delete academic affair successfully", async () => {
    await AcademicAffairService.createAA("AA001", "FIT", 1);

    const newAA = await db.AcademicAffair.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      nest: true,
      raw: true,
      attributes: ["id"],
    });

    await expect(AcademicAffairService.deleteAA(newAA[0].id)).resolves.toEqual({
      EM: "Delete academic affair successfully",
      EC: 0,
      DT: "",
    });
  });

  // Test invalid id case
  test.each(invalidAAID)(
    "Invalid academic affair id with id = %p",
    async (id) => {
      await expect(AcademicAffairService.deleteAA(id)).resolves.toEqual({
        EM: "Academic affair id is invalid",
        EC: 10,
        DT: "",
      });
    }
  );
});

describe("Test server error", () => {
  it("Server error with createAA", async () => {
    await db.sequelize.close();
    await expect(
      AcademicAffairService.createAA("AA001", "FIT", 1)
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with getAAById", async () => {
    await db.sequelize.close();
    await expect(AcademicAffairService.getAAById(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with getAAList", async () => {
    await db.sequelize.close();
    await expect(AcademicAffairService.getAAList()).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with updateAA", async () => {
    await db.sequelize.close();
    await expect(
      AcademicAffairService.updateAA(1, "AA001", "FIT", 1)
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with deleteAA", async () => {
    await db.sequelize.close();
    await expect(AcademicAffairService.deleteAA(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
