import streakoid from "../../src/sdk/streakoid";

const username = "sdk-user";
const email = "sdk-user@gmail.com";

const secondUsername = "second-sdk-user";
const secondEmail = "second-email@gmail.com";

describe("SDK users", () => {
  let userId: string;

  beforeAll(async () => {
    const response = await streakoid.users.create(username, email);
    userId = response.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  describe("getAll", () => {
    test("returns created user correctly in response", async () => {
      expect.assertions(3);

      const response = await streakoid.users.getAll(username);

      expect(response.data.users).toHaveLength(1);
      expect(response.data.users[0].username).toEqual(username);
      expect(response.data.users[0].email).toEqual(email);
    });
  });

  describe("getOne", () => {
    test("returns specific user correctly in response", async () => {
      expect.assertions(2);

      const response = await streakoid.users.getOne(userId);

      expect(response.data.user.username).toEqual(username);
      expect(response.data.user.email).toEqual(email);
    });
  });

  describe("create", () => {
    test("creates user and returns it correctly in response", async () => {
      expect.assertions(2);

      const response = await streakoid.users.create(
        secondUsername,
        secondEmail
      );

      expect(response.data.username).toEqual(secondUsername);
      expect(response.data.email).toEqual(secondEmail);

      // Clean up database after test
      await streakoid.users.deleteOne(response.data._id);
    });
  });

  describe("deleteOne", () => {
    test("deletes user and returns it correctly in response", async () => {
      // Create a new user for this test.
      const deleteUsername = "deleteUsername";
      const deleteEmail = "delete-email@gmail.com";
      const createResponse = await streakoid.users.create(
        deleteUsername,
        deleteEmail
      );
      const deleteId = createResponse.data._id;

      expect.assertions(1);

      const response = await streakoid.users.deleteOne(deleteId);

      expect(response.status).toEqual(204);
    });
  });
});
