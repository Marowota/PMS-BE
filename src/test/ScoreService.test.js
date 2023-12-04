import ScoreService from "../service/ScoreService";
import db from "../models/index";

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
});

it("Test 1 + 1 = 2", () => {
  expect(1 + 1).toEqual(2);
});
