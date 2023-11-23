("use strict");
const { fakerVI } = require("@faker-js/faker");
const { UniqueEnforcer } = require("enforce-unique");
const { SEPJ1N2324 } = require("./temp-data/se-pj-da1-23-24");
const { SEPJ2N2324 } = require("./temp-data/se-pj-da2-23-24");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Config
    const faker = fakerVI;
    const numberOfAA = 5;
    const numberOfStudent = 75;
    const numberOfTeacher = 10;
    const numberOfUser = numberOfAA + numberOfStudent + numberOfTeacher;
    const numberOfAccount = numberOfUser;
    const numberOfProject = 100;
    const numberOfImplementation = numberOfProject;
    const numberOfAnnouncement = 50;
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
    const academicDegreeList = ["CN", "KS", "ThS", "TS"];
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

    //if done then remove rather than enforce
    const getRandUniqSomethingID = (
      somethingInDb,
      ueSomethingId,
      numberOfSomething,
      nullable = false
    ) => {
      if (nullable) {
        if (faker.datatype.boolean(0.5)) {
          return null;
        }
      }
      try {
        let randIndex = faker.number.int({
          min: 0,
          max: somethingInDb.length - 1,
        });
        let bruh = somethingInDb[randIndex].id;
        somethingInDb.splice(randIndex, 1);
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
      const genStudentID = () => {
        let tmpF = faker.number.int({
          min: 18,
          max: 23,
        });
        let tmpL =
          "000" +
          faker.number.int({
            min: 1,
            max: 9999,
          });
        tmpL = tmpL.substring(tmpL.length - 4);
        return tmpF + "52" + tmpL;
      };

      return ueNStudentL.enforce(genStudentID);
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
        phone: null,
      })
      .map(() => {
        const fn = faker.person.firstName();
        const ln = faker.person.lastName();
        return {
          name: ln + " " + fn,
          email: faker.internet.email({ firstName: fn, lastName: ln }),
          dateOfBirth: faker.date.birthdate(),
          phone: faker.phone.number(),
        };
      });

    await queryInterface.bulkInsert("User", userList, {});

    const userInDb = await queryInterface.sequelize.query(
      `SELECT id from user order by id desc limit ${numberOfUser}`
    );

    console.log(">> Seeded User successfully");

    // Account

    let accUserInDb = Array.from(userInDb[0]);

    console.log(accUserInDb.length);
    let accountList = Array(numberOfAccount)
      .fill({
        username: null,
        password: null,
        role: null,
        status: null,
        userID: null,
      })
      .map(() => {
        let temp = getRandUniqSomethingID(accUserInDb, ueId, numberOfUser);
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

    let aaStuTechUserInDb = Array.from(userInDb[0]);

    console.log(aaStuTechUserInDb.length);

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
          userID: getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser),
        };
      });

    await queryInterface.bulkInsert("AcademicAffair", aaList, {});

    console.log(">> Seeded Academic Affair successfully");

    // Student

    console.log(aaStuTechUserInDb.length);
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
          userID: getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser),
        };
      });

    await queryInterface.bulkInsert("Student", studentList, {});

    console.log(">> Seeded Student successfully");

    const studentInDb = await queryInterface.sequelize.query(
      `SELECT id from student order by id desc limit ${numberOfStudent}`
    );

    // Teacher

    console.log(aaStuTechUserInDb.length);
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
          userID: getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser),
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

    let impStudentInDb = Array.from(studentInDb[0]);
    let impProjectInDb = Array.from(projectInDb[0]);

    let implementationList = Array(numberOfImplementation)
      .fill({
        student1ID: null,
        student2ID: null,
        projectID: null,
        score: null,
        isCompleted: null,
      })
      .map(() => {
        return {
          student1ID: getRandUniqSomethingID(
            impStudentInDb,
            ueStudentId,
            numberOfStudent,
            true
          ),
          student2ID: getRandUniqSomethingID(
            impStudentInDb,
            ueStudentId,
            numberOfStudent,
            true
          ),
          projectID: getRandUniqSomethingID(
            impProjectInDb,
            ueProjectId,
            numberOfProject
          ),
          score: faker.number.float({ min: 0, max: 10, precision: 0.01 }),
          isCompleted: faker.datatype.boolean(0.25),
        };
      });

    await queryInterface.bulkInsert("Implementation", implementationList, {});

    console.log(">> Seeded Implementation successfully");

    //Announcement

    let announcementList = Array(numberOfAnnouncement)
      .fill({
        title: null,
        content: null,
        dateCreated: null,
        dateUpdated: null,
        isPublic: null,
      })
      .map(() => {
        let tmp = faker.date.past();
        return {
          title: faker.commerce.product(),
          content: faker.commerce.productDescription(),
          dateCreated: tmp,
          dateUpdated: faker.date.between({
            from: tmp,
            to: new Date(),
          }),
          isPublic: faker.datatype.boolean(0.75),
        };
      });

    await queryInterface.bulkInsert("Announcement", announcementList, {});

    console.log(">> Seeded Announcement successfully");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Announcement", null, {});
    await queryInterface.bulkDelete("implementation", null, {});
    await queryInterface.bulkDelete("Project", null, {});
    await queryInterface.bulkDelete("Teacher", null, {});
    await queryInterface.bulkDelete("Student", null, {});
    await queryInterface.bulkDelete("AcademicAffair", null, {});
    await queryInterface.bulkDelete("Account", null, {});
    await queryInterface.bulkDelete("User", null, {});
  },
};
