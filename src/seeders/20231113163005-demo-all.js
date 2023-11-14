("use strict");
const { faker } = require("@faker-js/faker");
const { UniqueEnforcer } = require("enforce-unique");
const { SEPJ1N2324 } = require("./temp-data/se-pj-da1-23-24");
const { SEPJ2N2324 } = require("./temp-data/se-pj-da2-23-24");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Config
    const numberOfAA = 2;
    const numberOfStudent = 3;
    const numberOfTeacher = 4;
    const numberOfUser = numberOfAA + numberOfStudent + numberOfTeacher;
    const numberOfAccount = numberOfUser;
    const numberOfProject = 50;
    const numberOfImplementation = numberOfProject;
    // Constant
    const roleList = ["aa", "teacher", "student", "admin"];
    const facultyList = [
      "Công nghệ Phần mềm",
      "Hệ thống Thông tin",
      "Kỹ thuật Máy tính",
      "MMT & Truyền thông",
      "Khoa học Máy tính",
      "Khoa học và Kỹ thuật Thông tin",
    ];
    const majorList = [
      "An toàn Thông tin",
      "Công nghệ Thông tin",
      "Khoa học Máy tính",
      "Hệ thống Thông tin",
      "Kỹ thuật Phần mềm",
      "Kỹ thuật Máy tính",
      "MMT & Truyền thông Dữ liệu",
      "Thương mai điện tử",
      "Khoa học Dữ liệu",
    ];
    const academicDegreeList = [
      "Cử nhân, Thạc sĩ, Tiến sĩ, Phó giáo sư, Giáo sư",
    ];
    // Unique Enforcers
    let ueId = new UniqueEnforcer();
    let ueTeacherId = new UniqueEnforcer();
    let ueStudentId = new UniqueEnforcer();
    let ueProjectId = new UniqueEnforcer();
    let ueNumberAA = new UniqueEnforcer();
    let ueNStudentF = new UniqueEnforcer();
    let ueNStudentL = new UniqueEnforcer();
    let ueNTeacher = new UniqueEnforcer();
    let ueNPJName = new UniqueEnforcer();

    // Suuporting function
    const getRandSomethingID = (somethingInDb, numberOfSomething) => {
      let bruh =
        somethingInDb[0][
          faker.number.int({
            min: 0,
            max: numberOfSomething - 1,
          })
        ].id;
      return bruh;
    };

    const getRandUniqSomethingID = (
      somethingInDb,
      ueSomethingId,
      numberOfSomething,
      nullable = false
    ) => {
      if (nullable) {
        if (faker.datatype.boolean(0.5)) return null;
      }
      try {
        let bruh =
          somethingInDb[0][
            ueSomethingId.enforce(() => {
              return faker.number.int({
                min: 0,
                max: numberOfSomething - 1,
              });
            })
          ].id;
        return bruh;
      } catch {
        return null;
      }
    };

    const getRandUniqAAID = () => {
      let tmp = ueNumberAA.enforce(() => {
        return faker.number.int({
          min: 1,
          max: numberOfAA,
        });
      });
      return "AA" + tmp;
    };

    const getRandUniqStudentID = () => {
      let tmpF = ueNStudentF.enforce(() => {
        return faker.number.int({
          min: 18,
          max: 23,
        });
      });
      let tmpL = (
        "000" +
        ueNStudentL.enforce(() => {
          return faker.number.int({
            min: 1,
            max: 9999,
          });
        })
      ).substring(4);
      return tmpF + "52" + tmpL;
    };

    const getRandUniqTeacherCode = () => {
      return (
        "TC" +
        ueNTeacher.enforce(() => {
          return faker.number.int({
            min: 1,
            max: numberOfTeacher,
          });
        })
      );
    };

    const getRandUniqPJName = (type) => {
      let pj;
      if (type == 1) {
        pj = SEPJ1N2324;
      } else {
        pj = SEPJ2N2324;
      }
      return ueNPJName.enforce(() => {
        temp = faker.helpers.arrayElement(pj);
        return temp;
      });
    };

    console.log(">> loading");

    // Generate data
    // user

    let userList = Array(numberOfUser)
      .fill({
        name: null,
        email: null,
        dateOfBirth: null,
      })
      .map(() => {
        return {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          dateOfBirth: faker.date.birthdate(),
        };
      });

    await queryInterface.bulkInsert("User", userList, {});

    const userInDb = await queryInterface.sequelize.query(
      `SELECT id from user order by id desc limit ${numberOfUser}`
    );

    console.log(">> Seeded User successfully");

    // Account

    let accountList = Array(numberOfAccount)
      .fill({
        username: null,
        password: null,
        role: null,
        status: null,
        userID: null,
      })
      .map(() => {
        let temp = getRandUniqSomethingID(userInDb, ueId, numberOfUser);
        return {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          role: faker.helpers.arrayElement(roleList),
          status: "",
          userID: temp,
        };
      });

    ueId = new UniqueEnforcer(); //reset after adding to account
    await queryInterface.bulkInsert("Account", accountList, {});

    console.log(">> Seeded Account successfully", ueId);

    // Academic affair

    let aaList = Array(numberOfAA)
      .fill({
        academicAffairCode: null,
        faculty: null,
        userID: null,
      })
      .map(() => {
        return {
          academicAffairCode: getRandUniqAAID(),
          faculty: faker.helpers.arrayElement(facultyList),
          userID: getRandUniqSomethingID(userInDb, ueId, numberOfUser),
        };
      });

    await queryInterface.bulkInsert("AcademicAffair", aaList, {});

    console.log(">> Seeded Academic Affair successfully");

    // Student

    let studentList = Array(numberOfStudent)
      .fill({
        studentCode: null,
        class: null,
        major: null,
        status: null,
        userID: null,
      })
      .map(() => {
        return {
          studentCode: getRandUniqStudentID(),
          class: "",
          major: faker.helpers.arrayElement(majorList),
          status: faker.number.int({ min: 0, max: 2 }),
          userID: getRandUniqSomethingID(userInDb, ueId, numberOfUser),
        };
      });

    const studentInDb = await queryInterface.sequelize.query(
      `SELECT id from student order by id desc limit ${numberOfStudent}`
    );

    await queryInterface.bulkInsert("Student", studentList, {});

    console.log(">> Seeded Student successfully");

    // Teacher

    let teacherList = Array(numberOfTeacher)
      .fill({
        teacherCode: null,
        faculty: null,
        academicDegree: null,
        userID: null,
      })
      .map(() => {
        return {
          teacherCode: getRandUniqTeacherCode(),
          faculty: faker.helpers.arrayElement(facultyList),
          academicDegree: faker.helpers.arrayElement(academicDegreeList),
          userID: getRandUniqSomethingID(userInDb, ueId, numberOfUser),
        };
      });

    await queryInterface.bulkInsert("Teacher", teacherList, {});

    const teacherInDb = await queryInterface.sequelize.query(
      `SELECT id from teacher order by id desc limit ${numberOfTeacher}`
    );

    console.log(">> Seeded Techer successfully");

    // Project

    let temp;
    let projectList = Array(numberOfProject)
      .fill({
        type: null,
        name: null,
        teacherID: null,
        requirement: null,
        maxStudentNumber: null,
        faculty: null,
        isPublic: null,
        isRegistered: null,
      })
      .map(() => {
        return {
          type: (temp = faker.number.int({ min: 1, max: 2 })),
          name: getRandUniqPJName(temp),
          teacherID: getRandSomethingID(teacherInDb, numberOfTeacher),
          requirement: "",
          maxStudentNumber: faker.number.int({ min: 1, max: 2 }),
          faculty: faker.helpers.arrayElement(facultyList),
          isPublic: faker.datatype.boolean(0.5),
          isRegistered: faker.datatype.boolean(0.5),
        };
      });

    await queryInterface.bulkInsert("Project", projectList, {});

    const projectInDb = await queryInterface.sequelize.query(
      `SELECT id from project order by id desc limit ${numberOfProject}`
    );

    console.log(">> Seeded Project successfully");

    // Implementation

    let implementationList = Array(numberOfImplementation)
      .fill({
        studentID: null,
        projectID: null,
        score: null,
        isCompleted: null,
      })
      .map(() => {
        return {
          studentID: getRandUniqSomethingID(
            studentInDb,
            ueStudentId,
            numberOfStudent,
            true
          ),
          projectID: getRandUniqSomethingID(
            projectInDb,
            ueProjectId,
            numberOfProject
          ),
          score: faker.number.int({ min: 0, max: 10 }),
          isCompleted: faker.datatype.boolean(0.25),
        };
      });

    await queryInterface.bulkInsert("Implementation", implementationList, {});

    console.log(">> Seeded Implementation successfully");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("implementation", null, {});
    await queryInterface.bulkDelete("Project", null, {});
    await queryInterface.bulkDelete("Teacher", null, {});
    await queryInterface.bulkDelete("Student", null, {});
    await queryInterface.bulkDelete("AcademicAffair", null, {});
    await queryInterface.bulkDelete("Account", null, {});
    await queryInterface.bulkDelete("User", null, {});
  },
};
