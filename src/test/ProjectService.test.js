import ProjectService from "../service/ProjectService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const util = require("util");

const successProject = [
  ["Project name", 1, "Project Requirement", "1", "Software Engineering"],
];

const invalidProject = [
  [1, 1, "Project Requirement", "1", "Software Engineering"],
  ["", 1, "Project Requirement", "1", "Software Engineering"],
  ["Project name", 0, "Project Requirement", "1", "Software Engineering"],
  ["Project name", "abc", "Project Requirement", "1", "Software Engineering"],
  ["Project name", 1, 1, "1", "Software Engineering"],
  ["Project name", 1, "Project Requirement", 1, "Software Engineering"],
  ["Project name", 1, "Project Requirement", "1", 1],
  ["Project name", 1, "Project Requirement", "1", ""],
];

const invalidID = [0, "abc"];

const validTimeData = [
  [
    "2023-12-23T15:17",
    "2024-01-06T15:17",
    "Software Engineering",
    "2023",
    "HOC KY TEST",
  ],
];

const invalidTimeData = [
  [1, "2024-01-06T15:17", "Software Engineering", "2023", "HOC KY TEST"],
  ["", "2024-01-06T15:17", "Software Engineering", "2023", "HOC KY TEST"],
  ["2023-12-23T15:17", 1, "Software Engineering", "2023", "HOC KY TEST"],
  ["2023-12-23T15:17", "", "Software Engineering", "2023", "HOC KY TEST"],
  ["2023-12-23T15:17", "2024-01-06T15:17", 1, "2023", "HOC KY TEST"],
  ["2023-12-23T15:17", "2024-01-06T15:17", "", "2023", "HOC KY TEST"],
  [
    "2023-12-23T15:17",
    "2024-01-06T15:17",
    "Software Engineering",
    1,
    "HOC KY TEST",
  ],
  [
    "2023-12-23T15:17",
    "2024-01-06T15:17",
    "Software Engineering",
    "",
    "HOC KY TEST",
  ],
  ["2023-12-23T15:17", "2024-01-06T15:17", "Software Engineering", "2023", 1],
  ["2023-12-23T15:17", "2024-01-06T15:17", "Software Engineering", "2023", ""],
];

const existProject = "The Intelligent Recommender System";

// Test get project list
describe("Test getProjectList", () => {
  it("Get project list successfully", async () => {
    await expect(ProjectService.getProjectList(1)).resolves.toEqual({
      EM: "Get project list successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

// Test get project with pagination
// describe("\nTest get project with pagination", () => {
//   it("Get project with pagination successfully", async () => {
//     await expect(
//       ProjectService.getProjectWithPagination(1, 10)
//     ).resolves.toEqual({
//       EM: "Get project with pagination successfully",
//       EC: 0,
//       DT: expect.objectContaining({
//         totalRows: expect.any(Number),
//         totalPage: expect.any(Number),
//         projects: expect.any(Array),
//       }),
//     });
//   });
// });

// Test get project by id
describe("\nTest getProjectByID", () => {
  // Test success case
  it("Get project by id successfully", async () => {
    await ProjectService.createProject({
      projectName: "Project 1",
      teacherId: 1,
      projectRequirement: "Requirement 1",
      projectType: "1",
      projectFaculty: "Software Engineering",
    });

    const newProject = await db.Project.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
      attributes: ["id"],
    });

    await expect(
      ProjectService.getProjectById(newProject[0].id)
    ).resolves.toEqual({
      EM: "Get project by id successfully",
      EC: 0,
      DT: expect.objectContaining({
        Teacher: expect.objectContaining({
          User: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            phone: expect.any(String),
          }),
          id: expect.any(Number),
          faculty: expect.any(String),
          academicDegree: expect.any(String),
        }),
        faculty: expect.any(String),
        id: expect.any(Number),
        isregistered: expect.any(Number),
        name: expect.any(String),
        requirement: expect.any(String),
        type: expect.any(String),
      }),
    });

    await ProjectService.deleteProject([newProject[0].id]);
  });

  // Test not found case
  it("Get project by id not found", async () => {
    await expect(ProjectService.getProjectById(100000)).resolves.toEqual({
      EM: "Project not found",
      EC: 16,
      DT: "",
    });
  });

  test.each(invalidID)("Invalid project id", async (id) => {
    await expect(ProjectService.getProjectById(id)).resolves.toEqual({
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    });
  });
});

// Test is project valid
describe("\nTest isProjectValid", () => {
  // Test valid case
  it("Test valid case", async () => {
    await ProjectService.createProject({
      projectName: "Project 1111",
      teacherId: 1,
      projectRequirement: "Requirement 1",
      maxStudentNumber: 1,
      projectType: "1",
      projectFaculty: "Software Engineering",
    });

    const newProject = await db.Project.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
      attributes: ["id"],
    });

    await expect(
      ProjectService.isProjectValid("Project 1111")
    ).resolves.toBeTruthy();

    await ProjectService.deleteProject([newProject[0].id]);
  });

  // Test invalid case
  it("Test invalid case", async () => {
    await expect(
      ProjectService.isProjectValid("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    ).resolves.toBeFalsy();
  });
});

// Test create project
describe("\nTest createProject", () => {
  // Test success case
  test.each(successProject)(
    "Success create with projectName = %p, teacherId = %p, projectRequirement = %p,\n\tprojectType = %p, projectFaculty = %p",
    async (
      projectName,
      teacherId,
      projectRequirement,
      projectType,
      projectFaculty
    ) => {
      await expect(
        ProjectService.createProject({
          projectName: projectName,
          teacherId: teacherId,
          projectRequirement: projectRequirement,
          projectType: projectType,
          projectFaculty: projectFaculty,
        })
      ).resolves.toEqual({
        EM: "Create project successfully",
        EC: 0,
        DT: "",
      });

      const newProject = await db.Project.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
        attributes: ["id"],
      });
      console.log(newProject);

      await ProjectService.deleteProject([newProject[0].id]);
    }
  );

  // Test invalid case
  test.each(invalidProject)(
    "Invalid project information with projectName = %p, teacherId = %p, projectRequirement = %p,\n\tprojectType = %p, projectFaculty = %p",
    async (
      projectName,
      teacherId,
      projectRequirement,
      projectType,
      projectFaculty
    ) => {
      await expect(
        ProjectService.createProject({
          projectName: projectName,
          teacherId: teacherId,
          projectRequirement: projectRequirement,
          projectType: projectType,
          projectFaculty: projectFaculty,
        })
      ).resolves.toEqual({
        EM: "Project information is invalid",
        EC: 13,
        DT: "",
      });
    }
  );

  // Test project exist case
  it("Project exist", async () => {
    await expect(
      ProjectService.createProject(
        {
          projectName: existProject,
          teacherId: 1,
          projectRequirement: "Requirement 1",
          projectType: "1",
          projectFaculty: "Software Engineering",
        },
        1
      )
    ).resolves.toEqual({
      EM: "Project is already exist",
      EC: 12,
      DT: "",
    });
  });
});

// Test update project
describe("\nTest updateProject", () => {
  // Test success case
  it("Success update project", async () => {
    await ProjectService.createProject({
      projectName: "Project 1",
      teacherId: 1,
      projectRequirement: "Requirement 1",
      projectType: "1",
      projectFaculty: "Software Engineering",
    });

    const newProject = await db.Project.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
      attributes: ["id"],
    });

    await expect(
      ProjectService.updateProject(
        {
          projectName: "Project 2",
          teacherId: 2,
          projectRequirement: "New Requirement",
          projectType: "2",
          projectFaculty: "Computer Science",
        },
        newProject[0].id
      )
    ).resolves.toEqual({
      EM: "Update project successfully",
      EC: 0,
      DT: "",
    });

    await ProjectService.deleteProject([newProject[0].id]);
  });

  // Test invalid project id case
  test.each(invalidID)("Invalid project id", async (id) => {
    await expect(
      ProjectService.updateProject(
        {
          projectName: "Project 2",
          teacherId: 2,
          projectRequirement: "New Requirement",
          projectType: "2",
          projectFaculty: "Computer Science",
        },
        id
      )
    ).resolves.toEqual({
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    });
  });

  // Test project not found case
  it("Project not found", async () => {
    await expect(
      ProjectService.updateProject(
        {
          projectName: "Project 1",
          teacherId: 1,
          projectRequirement: "Requirement 1",
          projectType: "1",
          projectFaculty: "Software Engineering",
        },
        100000
      )
    ).resolves.toEqual({
      EM: "Project not found",
      EC: 16,
      DT: "",
    });
  });

  // Test invalid project information case
  test.each(invalidProject)(
    "Invalid project information with projectName = %p, teacherId = %p, projectRequirement = %p,\n\tprojectType = %p, projectFaculty = %p",
    async (
      projectName,
      teacherId,
      projectRequirement,
      projectType,
      projectFaculty
    ) => {
      await ProjectService.createProject({
        projectName: "Project 1",
        teacherId: 1,
        projectRequirement: "Requirement 1",
        projectType: "1",
        projectFaculty: "Software Engineering",
      });

      const newProject = await db.Project.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
        attributes: ["id"],
      });

      await expect(
        ProjectService.updateProject(
          {
            projectName: projectName,
            teacherId: teacherId,
            projectRequirement: projectRequirement,
            projectType: projectType,
            projectFaculty: projectFaculty,
          },
          newProject[0].id
        )
      ).resolves.toEqual({
        EM: "Project information is invalid",
        EC: 13,
        DT: "",
      });

      await ProjectService.deleteProject([newProject[0].id]);
    }
  );
});

// Test delete project
describe("\nTest deleteProject", () => {
  // Test success case
  it("Success delete", async () => {
    await ProjectService.createProject({
      projectName: "Test delete project",
      teacherId: 1,
      projectRequirement: "Requirement 1",
      projectType: "1",
      projectFaculty: "Software Engineering",
    });

    const newProject = await db.Project.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
      attributes: ["id"],
    });

    console.log(newProject);

    await expect(
      ProjectService.deleteProject([newProject[0].id])
    ).resolves.toEqual({
      EM: "Delete project successfully",
      EC: 0,
      DT: "",
    });
  });

  // Test invalid project id list case
  it("Invalid project id list", async () => {
    await expect(ProjectService.deleteProject({ id: 123 })).resolves.toEqual({
      EM: "Project id list is invalid",
      EC: 14,
      DT: "",
    });
  });

  // Test invalid project id case
  it("Invalid project id", async () => {
    await expect(ProjectService.deleteProject([0, "abc"])).resolves.toEqual({
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    });
  });

  it("Project is registered", async () => {
    await expect(ProjectService.deleteProject([100])).resolves.toEqual({
      EM: "Project is registered, cant delete",
      EC: 29,
      DT: "",
    });
  });
});

// Test get all time
describe("\nTest getAllTime", () => {
  it("Get all time successfully", async () => {
    await expect(ProjectService.getAllTime()).resolves.toEqual({
      EM: "Get all time successfully",
      EC: 0,
      DT: expect.any(Array),
    });
  });
});

describe("\nTest createTime", () => {
  test.each(validTimeData)(
    "Success create time",
    async (start, end, faculty, year, semester) => {
      const newTime = await ProjectService.createTime({
        newStart: start,
        newEnd: end,
        faculty: faculty,
        newYear: year,
        newSemester: semester,
      });

      expect(newTime).toEqual({
        EM: "Create time successfully",
        EC: 0,
        DT: newTime.DT,
      });

      await ProjectService.deleteTime(newTime.DT.id);
    }
  );

  test.each(invalidTimeData)(
    "Invalid time",
    async (start, end, faculty, year, semester) => {
      await expect(
        ProjectService.createTime({
          newStart: start,
          newEnd: end,
          faculty: faculty,
          newYear: year,
          newSemester: semester,
        })
      ).resolves.toEqual({
        EM: "Time data is invalid",
        EC: 30,
        DT: "",
      });
    }
  );
});

describe("\nTest updateTime", () => {
  it("Success update time", async () => {
    const newTime = await ProjectService.createTime({
      newStart: "2023-12-23T15:17",
      newEnd: "2024-01-06T15:17",
      faculty: "Software Engineering",
      newYear: "2023",
      newSemester: "HOC KY TEST",
    });

    const newUpdatedTime = await ProjectService.updateTime({
      newStart: "2023-12-23T15:17",
      newEnd: "2024-01-06T15:17",
      faculty: "Software Engineering",
      newYear: "2023",
      newSemester: "HOC KY TEST 2222",
      id: newTime.DT.id,
    });

    expect(newUpdatedTime).toEqual({
      EM: "Update time successfully",
      EC: 0,
      DT: newUpdatedTime.DT,
    });

    await ProjectService.deleteTime(newTime.DT.id);
  });

  test.each(invalidTimeData)(
    "Invalid time",
    async (start, end, faculty, year, semester) => {
      await expect(
        ProjectService.updateTime({
          newStart: start,
          newEnd: end,
          faculty: faculty,
          newYear: year,
          newSemester: semester,
          id: 1,
        })
      ).resolves.toEqual({
        EM: "Time data is invalid",
        EC: 30,
        DT: "",
      });
    }
  );

  test.each(invalidID)("Invalid time id", async (id) => {
    await expect(
      ProjectService.updateTime({
        newStart: "2023-12-23T15:17",
        newEnd: "2024-01-06T15:17",
        faculty: "Software Engineering",
        newYear: "2023",
        newSemester: "HOC KY TEST",
        id: id,
      })
    ).resolves.toEqual({
      EM: "Time id is invalid",
      EC: 33,
      DT: "",
    });
  });
});

describe("\nTest deleteTime", () => {
  it("Success delete time", async () => {
    const newTime = await ProjectService.createTime({
      newStart: "2023-12-23T15:17",
      newEnd: "2024-01-06T15:17",
      faculty: "Software Engineering",
      newYear: "2023",
      newSemester: "HOC KY TEST",
    });

    await expect(ProjectService.deleteTime(newTime.DT.id)).resolves.toEqual({
      EM: "Delete time successfully",
      EC: 0,
      DT: "",
    });
  });

  test.each(invalidID)("Invalid time id", async (id) => {
    await expect(ProjectService.deleteTime(id)).resolves.toEqual({
      EM: "Time id is invalid",
      EC: 33,
      DT: "",
    });
  });
});

describe("\nTest setProjectTime", () => {
  it("Success set project time", async () => {
    await expect(
      ProjectService.setProjectTime({
        timeId: 1,
        selectedProject: [{ id: 1 }, { id: 2 }],
      })
    ).resolves.toEqual({
      EM: "Set project time successfully",
      EC: 0,
      DT: "",
    });
  });

  test.each(invalidID)("Invalid time id", async (id) => {
    await expect(
      ProjectService.setProjectTime({
        timeId: id,
        selectedProject: [{ id: 1 }, { id: 2 }],
      })
    ).resolves.toEqual({
      EM: "Time id is invalid",
      EC: 33,
      DT: "",
    });
  });

  test.each(invalidID)("Invalid project id", async (id) => {
    await expect(
      ProjectService.setProjectTime({
        timeId: 1,
        selectedProject: [{ id: id }, { id: 2 }],
      })
    ).resolves.toEqual({
      EM: "Project id is invalid",
      EC: 15,
      DT: "",
    });
  });
});

describe("\nTest server error with each function", () => {
  it("Test get project list", async () => {
    await db.sequelize.close();
    await expect(ProjectService.getProjectList(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test get project with pagination", async () => {
    await db.sequelize.close();
    await expect(
      ProjectService.getProjectWithPagination(1, 10, "", null, null, false)
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test get project by id", async () => {
    await db.sequelize.close();
    await expect(ProjectService.getProjectById(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test create project", async () => {
    await db.sequelize.close();
    await expect(
      ProjectService.createProject({
        projectName: "Project name",
        teacherId: 1,
        projectRequirement: "Project Requirement",
        projectType: "1",
        projectFaculty: "Software Engineering",
      })
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test update project", async () => {
    await db.sequelize.close();
    await expect(
      ProjectService.updateProject(
        {
          projectName: "Project name",
          teacherId: 1,
          projectRequirement: "Project Requirement",
          projectType: "1",
          projectFaculty: "Software Engineering",
        },
        1
      )
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test delete project", async () => {
    await db.sequelize.close();
    await expect(ProjectService.deleteProject([1])).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test get all time", async () => {
    await db.sequelize.close();
    await expect(ProjectService.getAllTime()).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test create time", async () => {
    await db.sequelize.close();
    await expect(
      ProjectService.createTime({
        newStart: "2023-12-23T15:17",
        newEnd: "2024-01-06T15:17",
        faculty: "Software Engineering",
        newYear: "2023",
        newSemester: "HOC KY TEST",
      })
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test update time", async () => {
    await db.sequelize.close();
    await expect(
      ProjectService.updateTime({
        newStart: "2023-12-23T15:17",
        newEnd: "2024-01-06T15:17",
        faculty: "Software Engineering",
        newYear: "2023",
        newSemester: "HOC KY TEST",
        id: 1,
      })
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test delete time", async () => {
    await db.sequelize.close();
    await expect(ProjectService.deleteTime(1)).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  it("Test set project time", async () => {
    await db.sequelize.close();
    await expect(
      ProjectService.setProjectTime({
        timeId: 1,
        selectedProject: [{ id: 1 }, { id: 2 }],
      })
    ).resolves.toEqual({
      EM: "There are something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
