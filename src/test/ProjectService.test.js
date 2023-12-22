import ProjectService from "../service/ProjectService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

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
//       ProjectService.getProjectWithPagination(1, 10, "", null, null, false)
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
  it("Invalid project id", async () => {
    await expect(
      ProjectService.updateProject(
        {
          projectName: "Project 1",
          teacherId: 1,
          projectRequirement: "Requirement 1",
          projectType: 1,
          projectFaculty: "Software Engineering",
        },
        "abc"
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
    await expect(ProjectService.deleteProject(["abc", "def"])).resolves.toEqual(
      {
        EM: "Project id is invalid",
        EC: 15,
        DT: "",
      }
    );
  });
});
