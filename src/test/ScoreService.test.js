import ScoreService from "../service/ScoreService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

// Test get score list
describe("Test get score list", () => {
  it("Test success case", async () => {
    await expect(ScoreService.getScoreList()).resolves.toEqual({
      EM: "Get score list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

// Get score by id
describe("Test get score by id", () => {
  it("Test success case", async () => {
    await expect(ScoreService.getScoreById(85)).resolves.toEqual({
      EM: "Get score by id successfully",
      EC: 0,
      DT: expect.objectContaining({
        id: expect.any(Number),
        score: expect.any(Number),
        isCompleted: expect.any(Number),
      }),
    });
  });

  it("Test invalid id case", async () => {
    await expect(ScoreService.getScoreById(-1)).resolves.toEqual({
      EM: "Score id is invalid",
      EC: 7,
      DT: "",
    });
  });

  it("Test not found case", async () => {
    await expect(ScoreService.getScoreById(1000000)).resolves.toEqual({
      EM: "Score not found",
      EC: 8,
      DT: "",
    });
  });
});

// Test get score pagination
describe("Test get score pagination", () => {
  it("Test success case", async () => {
    await expect(ScoreService.getScorePagination(1, 10)).resolves.toEqual({
      EM: "Get score pagination successfully",
      EC: 0,
      DT: expect.objectContaining({
        totalRows: expect.any(Number),
        totalPage: expect.any(Number),
        scores: expect.any(Array),
      }),
    });
  });
});
