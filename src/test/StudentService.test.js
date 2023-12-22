import StudentServices from "../service/StudentServices";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const invalidStudentId = [0, "abc"];

describe("Test getProjectOfStudent", () => {
  it("Should get project of student successfully", async () => {
    await expect(StudentServices.getProjectOfStudent(58)).resolves.toEqual({
      EM: "Get project of student successfully",
      EC: 0,
      DT: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        type: expect.any(String),
        faculty: expect.any(String),
        requirement: expect.any(String),
        isregistered: expect.any(Number),
        Teacher: expect.any(Object),
        Implementation: expect.any(Object),
        score: expect.any(Number),
      }),
    });
  });

  test.each(invalidStudentId)(
    "Should return error message when student id is invalid",
    async (studentId) => {
      await expect(
        StudentServices.getProjectOfStudent(studentId)
      ).resolves.toEqual({
        EM: "Student id is invalid",
        EC: 25,
        DT: "",
      });
    }
  );

  it("Should return error message when student not found", async () => {
    await expect(StudentServices.getProjectOfStudent(100000)).resolves.toEqual({
      EM: "Student not found",
      EC: 26,
      DT: "",
    });
  });

  it("Should return error message when student has not registered any project yet", async () => {
    await expect(StudentServices.getProjectOfStudent(92)).resolves.toEqual({
      EM: "You have not registered any project yet!",
      EC: 27,
      DT: "",
    });
  });
});

describe("Test server error", () => {
  it("Server error with getProjectOfStudent", async () => {
    await db.sequelize.close();
    await expect(StudentServices.getProjectOfStudent(2)).resolves.toEqual({
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
