import request from "supertest";

import { ResponseCodes } from "../../../src/Server/responseCodes";
import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "search-user@gmail.com";
const registeredUsername = "search-user";

jest.setTimeout(120000);

describe("/users", () => {
  let userId: string;

  beforeAll(async () => {
    const createUserResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = createUserResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test(`returns user when full searchTerm is used`, async () => {
    expect.assertions(9);

    const response = await streakoid.users.getAll(registeredUsername);
    const users = response.data.users;

    expect(response.status).toEqual(ResponseCodes.success);

    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("streaks");
    expect(users[0]).toHaveProperty("type");
    expect(users[0]).toHaveProperty("_id");
    expect(users[0]).toHaveProperty("username");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");
  });

  test("returns user when partial searchTerm is used", async () => {
    expect.assertions(9);

    const response = await streakoid.users.getAll("search");
    const users = response.data.users;

    expect(response.status).toEqual(ResponseCodes.success);
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("streaks");
    expect(users[0]).toHaveProperty("type");
    expect(users[0]).toHaveProperty("_id");
    expect(users[0]).toHaveProperty("username");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");
  });
});
