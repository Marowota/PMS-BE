("use strict");
const { fakerVI } = require("@faker-js/faker");
const { UniqueEnforcer } = require("enforce-unique");
const { SEPJ1N2324 } = require("./temp-data/se-pj-da1-23-24");
const { SEPJ2N2324 } = require("./temp-data/se-pj-da2-23-24");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Config
    const faker = fakerVI;
    const numberOfAA = 5;
    const numberOfStudent = 75;
    const numberOfTeacher = 10;
    const numberOfAdmin = 1;
    const numberOfUser =
      numberOfAA + numberOfStudent + numberOfTeacher + numberOfAdmin;
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
      "Trí tuệ Nhân tạo",
      "Hệ thống Thông tin",
      "Kỹ thuật Phần mềm",
      "Kỹ thuật Máy tính",
      "MMT & Truyền thông Dữ liệu",
      "Thương mai điện tử",
      "Khoa học Dữ liệu",
    ];
    const combineFacuMajoList = [
      {
        faculty: "Công nghệ Phần mềm",
        major: "Kỹ thuật Phần mềm",
      },
      {
        faculty: "Hệ thống Thông tin",
        major: "Hệ thống Thông tin",
      },
      {
        faculty: "Hệ thống Thông tin",
        major: "Thương mai điện tử",
      },
      {
        faculty: "Kỹ thuật Máy tính",
        major: "Kỹ thuật Máy tính",
      },
      {
        faculty: "MMT & Truyền thông",
        major: "MMT & Truyền thông Dữ liệu",
      },
      {
        faculty: "MMT & Truyền thông",
        major: "An toàn Thông tin",
      },
      {
        faculty: "Khoa học Máy tính",
        major: "Khoa học Máy tính",
      },
      {
        faculty: "Khoa học Máy tính",
        major: "Trí tuệ Nhân tạo",
      },
      {
        faculty: "Khoa học và Kỹ thuật Thông tin",
        major: "Công nghệ Thông tin",
      },
      {
        faculty: "Khoa học và Kỹ thuật Thông tin",
        major: "Khoa học Dữ liệu",
      },
    ];
    const academicDegreeList = ["CN", "KS", "ThS", "TS"];
    const classNameList = [
      "SE121.O11.PMCL",
      "SE122.O12",
      "CE206.O11",
      "CE206.O11.KTCL",
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

    // ClassInfo

    let i = -1;
    let classInfoList = Array(classNameList.length)
      .fill({
        name: null,
      })
      .map(() => {
        i++;
        return {
          className: classNameList[i],
        };
      });

    await queryInterface.bulkInsert("ClassInfo", classInfoList, {});

    const classInfoInDb = await queryInterface.sequelize.query(
      `SELECT id from classinfo order by id desc limit ${classNameList.length}`
    );

    console.log(">> Seeded ClassInfo successfully");

    // Academic affair

    let aaStuTechUserInDb = Array.from(userInDb[0]);
    let aaUserIds = [];

    console.log(aaStuTechUserInDb.length);

    let aaList = Array(numberOfAA)
      .fill({
        academicAffairCode: null,
        faculty: null,
        userID: null,
      })
      .map(() => {
        let uid = getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser);
        aaUserIds.push(uid);
        return {
          academicAffairCode: getRandUniqAAID(),
          faculty: faker.helpers.arrayElement(facultyList),
          userID: uid,
        };
      });

    await queryInterface.bulkInsert("AcademicAffair", aaList, {});

    console.log(">> Seeded Academic Affair successfully");

    // Student
    let studentUserIds = [];

    console.log(aaStuTechUserInDb.length);
    let studentList = Array(numberOfStudent)
      .fill({
        studentCode: null,
        major: null,
        status: null,
        userID: null,
        classID: null,
      })
      .map(() => {
        let uid = getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser);
        studentUserIds.push(uid);
        return {
          studentCode: getRandUniqStudentID(),
          major: faker.helpers.arrayElement(majorList),
          status: faker.number.int({ min: 0, max: 2 }),
          userID: uid,
        };
      });

    await queryInterface.bulkInsert("Student", studentList, {});

    console.log(">> Seeded Student successfully");

    const studentInDb = await queryInterface.sequelize.query(
      `SELECT id from student order by id desc limit ${numberOfStudent}`
    );

    // Teacher

    let teacherUserIds = [];
    console.log(aaStuTechUserInDb.length);
    let teacherList = Array(numberOfTeacher)
      .fill({
        teacherCode: null,
        faculty: null,
        academicDegree: null,
        userID: null,
      })
      .map(() => {
        let uid = getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser);
        teacherUserIds.push(uid);
        return {
          teacherCode: getRandUniqTeacherCode(),
          faculty: faker.helpers.arrayElement(facultyList),
          academicDegree: faker.helpers.arrayElement(academicDegreeList),
          userID: uid,
        };
      });

    await queryInterface.bulkInsert("Teacher", teacherList, {});

    const teacherInDb = await queryInterface.sequelize.query(
      `SELECT id from teacher order by id desc limit ${numberOfTeacher}`
    );

    console.log(">> Seeded Techer successfully");

    // Account

    const hashUserPassword = (userPassword) => {
      let hashPassword = bcrypt.hashSync(userPassword, salt);
      return hashPassword;
    };

    ueId = new UniqueEnforcer(); //reset before adding to account
    let accUserInDb = Array.from(userInDb[0]);
    let tempRoleList = {
      aa: numberOfAA,
      teacher: numberOfTeacher,
      student: numberOfStudent,
      admin: numberOfAdmin,
    };
    let allRoleUserIdList = {
      aa: aaUserIds,
      student: studentUserIds,
      teacher: teacherUserIds,
    };

    console.log(accUserInDb.length);
    let accountList = Array(numberOfAccount)
      .fill({
        username: null,
        password: null,
        role: null,
        userID: null,
      })
      .map(() => {
        //let temp = getRandUniqSomethingID(accUserInDb, ueId, numberOfUser);
        let tempRole = faker.helpers.arrayElement(Object.keys(tempRoleList));
        let temp;
        if (tempRole == "admin") {
          temp = getRandUniqSomethingID(aaStuTechUserInDb, ueId, numberOfUser);
        } else {
          temp = allRoleUserIdList[tempRole][tempRoleList[tempRole] - 1];
        }
        tempRoleList[tempRole]--;
        if (tempRoleList[tempRole] <= 0) {
          delete tempRoleList[tempRole];
        }
        return {
          username: faker.internet.userName(),
          password: hashUserPassword("123"),
          role: tempRole,
          userID: temp,
        };
      });

    await queryInterface.bulkInsert("Account", accountList, {});

    console.log(">> Seeded Account successfully", ueId);

    // Project

    let temp;
    let projectList = Array(numberOfProject)
      .fill({
        name: null,
        teacherID: null,
        requirement: null,
        maxStudentNumber: null,
        type: null,
        faculty: null,

        major: null,
        classID: null,

        isPublic: null,
        isRegistered: null,
        registerTimeID: null,
      })
      .map(() => {
        const tempFaMaj = faker.helpers.arrayElement(combineFacuMajoList);

        return {
          name: getRandUniqPJName(temp),
          teacherID: getRandSomethingID(teacherInDb, numberOfTeacher),
          requirement: "",
          maxStudentNumber: faker.number.int({ min: 1, max: 2 }),
          type: (temp = faker.number.int({ min: 1, max: 2 })),
          faculty: tempFaMaj.faculty,

          major: tempFaMaj.major,
          classID: faker.helpers.arrayElement(classInfoInDb[0]).id,

          isPublic: faker.datatype.boolean(0.5),
          isRegistered: faker.datatype.boolean(0.5),
          registerTimeID: null,
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
        submissionLink: null,
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
          score: faker.number.float({ min: 0, max: 10, precision: 0.1 }),
          isCompleted: faker.datatype.boolean(0.25),
          submissionLink: null,
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
    await queryInterface.bulkDelete("ClassInfo", null, {});
  },
};
