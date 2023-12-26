import ScoreService from "../service/ScoreService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const invalidScoreId = [0, "abc"];
const validScore = [
  [{ score: 10 }, 1],
  [{ score: 5 }, 1],
  [{ score: 0 }, 1],
];
const invalidScore = [
  [{ score: 10.1 }, 1],
  [{ score: -0.9 }, 1],
  [{ score: "abc" }, 1],
];
const invalidImplementationId = [
  [{ score: 5 }, 0],
  [{ score: 5 }, "abc"],
];

const invalidSubmitLink = [
  [1, 1],
  [1, ""],
];
const invalidProjectId = [
  [0, "https://github.com"],
  ["abc", "https://github.com"],
];

// Test get score list
describe("Test getScoreList", () => {
  it("Test success case", async () => {
    await expect(
      ScoreService.getScoreList({ timeID: 1, teacherID: 1 })
    ).resolves.toEqual({
      EM: "Get score list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

// Get score by id
describe("\nTest getScoreByID", () => {
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

  test.each(invalidScoreId)("Test invalid score id", async (scoreId) => {
    await expect(ScoreService.getScoreById(scoreId)).resolves.toEqual({
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
// describe("\nTest get score pagination", () => {
//   it("Test success case", async () => {
//     await expect(ScoreService.getScorePagination(1, 10)).resolves.toEqual({
//       EM: "Get score pagination successfully",
//       EC: 0,
//       DT: expect.objectContaining({
//         totalRows: expect.any(Number),
//         totalPage: expect.any(Number),
//         scores: expect.any(Array),
//       }),
//     });
//   });
// });

describe("\nTest updateScore", () => {
  test.each(validScore)("Test valid update score", async (value, id) => {
    await expect(ScoreService.updateScore(value, id)).resolves.toEqual({
      EM: "Update score successfully",
      EC: 0,
      DT: "",
    });
  });

  test.each(invalidScore)(
    "Test invalid update score",
    async (value, implementationID) => {
      await expect(
        ScoreService.updateScore(value, implementationID)
      ).resolves.toEqual({
        EM: "Score is invalid",
        EC: 34,
        DT: "",
      });
    }
  );

  test.each(invalidImplementationId)(
    "Test invalid implementation id",
    async (value, implementationID) => {
      await expect(
        ScoreService.updateScore(value, implementationID)
      ).resolves.toEqual({
        EM: "Implementation id is invalid",
        EC: 35,
        DT: "",
      });
    }
  );
});

describe("\nTest updateSubmitLink", () => {
  it("Test success case", async () => {
    await expect(
      ScoreService.updateSubmitLink(1, "https://github.com")
    ).resolves.toEqual({
      EM: "Update submit link successfully",
      EC: 0,
      DT: "",
    });
  });

  test.each(invalidProjectId)(
    "Test invalid project id",
    async (projectId, submitLink) => {
      await expect(
        ScoreService.updateSubmitLink(projectId, submitLink)
      ).resolves.toEqual({
        EM: "Project id is invalid",
        EC: 15,
        DT: "",
      });
    }
  );

  test.each(invalidSubmitLink)(
    "Test invalid submit link",
    async (projectId, submitLink) => {
      await expect(
        ScoreService.updateSubmitLink(projectId, submitLink)
      ).resolves.toEqual({
        EM: "Submit link is invalid",
        EC: 36,
        DT: "",
      });
    }
  );
});

describe("\nTest server error with each function", () => {
  it("Server error with getScoreList", async () => {
    await db.sequelize.close();
    await expect(
      ScoreService.getScoreList({ time: 1, teacher: 1 })
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with getScoreById", async () => {
    await db.sequelize.close();
    await expect(ScoreService.getScoreById(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with getScorePagination", async () => {
    await db.sequelize.close();
    await expect(ScoreService.getScorePagination(1, 10)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with updateScore", async () => {
    await db.sequelize.close();
    await expect(ScoreService.updateScore({ score: 9 }, 1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Server error with updateSubmitLink", async () => {
    await db.sequelize.close();
    await expect(
      ScoreService.updateSubmitLink(1, "https://github.com")
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
