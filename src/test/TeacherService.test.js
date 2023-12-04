import TeacherService from "../service/TeacherService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Test get teacher list", () => {
  it("Get teacher list successfully", async () => {
    await expect(TeacherService.getTeacherList()).resolves.toEqual({
      EM: "Get teacher list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});
