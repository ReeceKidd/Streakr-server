import { ResponseCodes } from "../../../src/Server/responseCodes";
import streakoid from "../../../src/sdk/streakoid";

jest.setTimeout(120000);

describe(`POST /users`, () => {
  const username = "tester1";
  const email = "tester1@gmail.com";
  let userId: string;

  beforeAll(async () => {
    const response = await streakoid.users.create(username, email);
    userId = response.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test("user can register successfully", async () => {
    expect.assertions(8);

    const registerUsername = "registerUsername";
    const registerEmail = "register@gmail.com";

    const response = await streakoid.users.create(
      registerUsername,
      registerEmail
    );

    expect(response.status).toEqual(ResponseCodes.created);
    expect(response.data).toHaveProperty("streaks");
    expect(response.data).toHaveProperty("type");
    expect(response.data).toHaveProperty("_id");
    expect(response.data).toHaveProperty("email");
    expect(response.data).toHaveProperty("username");
    expect(response.data).toHaveProperty("createdAt");
    expect(response.data).toHaveProperty("updatedAt");

    // Delete created user to clear up the database
    const userId = response.data._id;
    await streakoid.users.deleteOne(userId);
  });

  test("fails because username is missing from request", async () => {
    expect.assertions(2);

    try {
      await streakoid.users.create("", email);
    } catch (err) {
      expect(err.response.status).toEqual(ResponseCodes.badRequest);
      expect(err.response.data.message).toEqual(
        'child "username" fails because ["username" is not allowed to be empty]'
      );
    }
  });

  test("fails because username already exists", async () => {
    expect.assertions(3);

    try {
      await streakoid.users.create(username, "new-email@gmail.com");
    } catch (err) {
      expect(err.response.status).toEqual(ResponseCodes.badRequest);
      expect(err.response.data.code).toBe("400-10");
      expect(err.response.data.message).toEqual(`Username already exists.`);
    }
  });

  test("fails because username must be a string", async () => {
    expect.assertions(2);

    try {
      await streakoid.users.create(123456 as any, "tester001@gmail.com");
    } catch (err) {
      expect(err.response.status).toEqual(ResponseCodes.unprocessableEntity);
      expect(err.response.data.message).toEqual(
        `child \"username\" fails because [\"username\" must be a string]`
      );
    }
  });

  test("fails because email is missing from request", async () => {
    expect.assertions(2);

    try {
      await streakoid.users.create(username, undefined as any);
    } catch (err) {
      expect(err.response.status).toEqual(ResponseCodes.unprocessableEntity);
      expect(err.response.data.message).toEqual(
        'child "email" fails because ["email" is required]'
      );
    }
  });

  test("fails because email already exists", async () => {
    expect.assertions(3);

    try {
      await streakoid.users.create("tester01", email);
    } catch (err) {
      expect(err.response.status).toEqual(ResponseCodes.badRequest);
      expect(err.response.data.code).toEqual("400-09");
      expect(err.response.data.message).toEqual(`User email already exists.`);
    }
  });

  test("fails because email is invalid", async () => {
    expect.assertions(2);

    try {
      await streakoid.users.create("tester01", "invalid email");
    } catch (err) {
      expect(err.response.status).toEqual(ResponseCodes.unprocessableEntity);
      expect(err.response.data.message).toEqual(
        `child \"email\" fails because [\"email\" must be a valid email]`
      );
    }
  });
});
