import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-user@gmail.com";
const registeredUsername = "delete-user";

const friendEmail = "delete-friend@gmail.com";
const friendUsername = "delete-friend";

jest.setTimeout(120000);

describe("DELETE /users/:userId/friends/:friendId", () => {
  let userId: string;
  let friendId: string;

  beforeAll(async () => {
    const userRegistrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = userRegistrationResponse.data._id;

    const friendRegistrationResponse = await streakoid.users.create(
      friendUsername,
      friendEmail
    );
    friendId = friendRegistrationResponse.data._id;

    await streakoid.users.friends.addFriend(userId, friendId);
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.users.deleteOne(friendId);
  });

  test(`user can delete a friend`, async () => {
    expect.assertions(1);

    const deleteFriendResponse = await streakoid.users.friends.deleteOne(
      userId,
      friendId
    );
    expect(deleteFriendResponse.status).toBe(204);
  });

  test(`can't delete a friend for a user that does not exist`, async () => {
    expect.assertions(3);

    try {
      await streakoid.users.friends.deleteOne(
        "5d54487483233622e43270f8",
        friendId
      );
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual("User does not exist.");
      expect(err.response.data.code).toEqual("400-21");
    }
  });

  test(`can't delete a friend who does not exist`, async () => {
    expect.assertions(3);

    try {
      await streakoid.users.friends.deleteOne(
        userId,
        "5d54487483233622e43270f8"
      );
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual("Friend does not exist.");
      expect(err.response.data.code).toEqual("400-22");
    }
  });
});
