import TeacherService from "../service/TeacherService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const invalidTeacherId = [0, "abc"];

describe("Test getTeacherList", () => {
  it("Get teacher list successfully", async () => {
    await expect(TeacherService.getTeacherList()).resolves.toEqual({
      EM: "Get teacher list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

describe("Test getAnalysisOfTeacher", () => {
  it("Should get analysis of teacher successfully", async () => {
    await expect(TeacherService.getAnalysisOfTeacher(1)).resolves.toEqual({
      EM: "Get analysis of teacher successfully",
      EC: 0,
      DT: expect.objectContaining({
        projectCount: expect.any(Number),
        totalStudentCount: expect.any(Number),
        registeredProjectsCount: expect.any(Number),
        unregisteredProjectsCount: expect.any(Number),
        avgStudentScore: expect.any(Number),
        medianStudentScore: expect.any(Number),
      }),
    });
  });

  test.each(invalidTeacherId)(
    "Should return invalid teacher id message",
    async (teacherId) => {
      await expect(
        TeacherService.getAnalysisOfTeacher(teacherId)
      ).resolves.toEqual({
        EM: "Teacher id is invalid",
        EC: 28,
        DT: "",
      });
    }
  );
});

describe("Test server error with each function", () => {
  it("getTeacherList with server error", async () => {
    await db.sequelize.close();
    await expect(TeacherService.getTeacherList()).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("getAnalysisOfTeacher with server error", async () => {
    await db.sequelize.close();
    await expect(TeacherService.getAnalysisOfTeacher(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
