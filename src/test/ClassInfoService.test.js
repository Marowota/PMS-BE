import ClassInfoService from "../service/ClassInfoService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const invalidClassName = [123, ""];
const invalidClassId = [0, "abc"];

describe("Test getAllClass", () => {
  it("Should return an array of class info", async () => {
    await expect(ClassInfoService.getAllClass()).resolves.toEqual({
      EM: "Get class info successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

describe("Test addNewClass", () => {
  it("Should successfully add new class", async () => {
    const newClass = await ClassInfoService.addNewClass({ newClass: "test" });

    expect(newClass).toEqual({
      EM: "Add class info successfully",
      EC: 0,
      DT: expect.any(Object),
    });

    await ClassInfoService.deleteClassService([newClass.DT.id]);
  });

  test.each(invalidClassName)(
    "Should return error message when class name is invalid",
    async (className) => {
      await expect(
        ClassInfoService.addNewClass({ newClass: className })
      ).resolves.toEqual({
        EM: "Class name is invalid",
        EC: 22,
        DT: "",
      });
    }
  );
});

describe("Test deleteClass", () => {
  it("Should successfully delete class", async () => {
    const newClass = await ClassInfoService.addNewClass({ newClass: "test" });
    await expect(
      ClassInfoService.deleteClassService([newClass.DT.id])
    ).resolves.toEqual({
      EM: "Delete class successfully",
      EC: 0,
      DT: "",
    });
  });

  test.each(invalidClassId)(
    "Should return error message when class id is invalid",
    async (classId) => {
      await expect(
        ClassInfoService.deleteClassService([classId, 1, 2])
      ).resolves.toEqual({
        EM: "Class id is invalid",
        EC: 23,
        DT: "",
      });
    }
  );

  it("Should return error message when class id list is empty", async () => {
    await expect(ClassInfoService.deleteClassService([])).resolves.toEqual({
      EM: "Class id list must not be empty",
      EC: 24,
      DT: "",
    });
  });
});

describe("Test server error with each function", () => {
  it("getAllClass with server error", async () => {
    await db.sequelize.close();
    await expect(ClassInfoService.getAllClass()).resolves.toEqual({
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("addNewClass with server error", async () => {
    await db.sequelize.close();
    await expect(
      ClassInfoService.addNewClass({ newClass: "test" })
    ).resolves.toEqual({
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("deleteClass with server error", async () => {
    await db.sequelize.close();
    await expect(ClassInfoService.deleteClassService([1, 2])).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
