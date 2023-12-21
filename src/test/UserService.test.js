import UserService from "../service/UserServices";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

const invalidCase = [0, "abc"];
const validCase = [29, 75, 20, 17];

// Test get user by id
describe("Test get user by id", () => {
  // Test success case
  test.each(validCase)("Success get user by id: %p", async (userID) => {
    await expect(UserService.getUserByID(userID)).resolves.toEqual({
      EM: "Get user successfully",
      EC: 0,
      DT: expect.any(Object),
    });
  });

  // Test invalid case
  test.each(invalidCase)("Invalid user id: %p", async (userID) => {
    await expect(UserService.getUserByID(userID)).resolves.toEqual({
      EM: "User id is invalid",
      EC: 19,
      DT: "",
    });
  });

  // Test not found case
  it("User not found", async () => {
    await expect(UserService.getUserByID(100000)).resolves.toEqual({
      EM: "User not found",
      EC: 20,
      DT: "",
    });
  });
});

// Test update user by id
describe("Test update user by id", () => {
  // Test success case
  test.each(validCase)("Success update user by id: %p", async (userID) => {
    await expect(
      UserService.updateUserById(userID, { name: "test" + userID })
    ).resolves.toEqual({
      EM: "Update user successfully",
      EC: 0,
      DT: expect.any(Object),
    });
  });

  // Test invalid case
  it('Invalid user data: "abc"', async () => {
    await expect(UserService.updateUserById(1, "abc")).resolves.toEqual({
      EM: "User data is invalid",
      EC: 21,
      DT: "",
    });
  });

  // Test invalid user id case
  test.each(invalidCase)("Invalid user id: %p", async (userID) => {
    await expect(
      UserService.updateUserById(userID, { name: "test" })
    ).resolves.toEqual({
      EM: "User id is invalid",
      EC: 19,
      DT: "",
    });
  });
});

// Test fail case with each function
describe("Test fail case with each function", () => {
  // False case with getUserByID function
  it("False case with getUserByID function", async () => {
    await db.sequelize.close();
    await expect(UserService.getUserByID(1)).resolves.toEqual({
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });

  // False case with updateUserById function
  it("False case with updateUserById function", async () => {
    await db.sequelize.close();
    await expect(
      UserService.updateUserById(1, { name: "test" })
    ).resolves.toEqual({
      EM: "There is something wrong in the server's services",
      EC: -1,
      DT: "",
    });
  });
});
