import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "friends.get.user@gmail.com";
const registeredUsername = "friends-get-user";

const friendEmail = "friend.get.emai@gmail.com";
const friendUsername = "friend-get-username";

jest.setTimeout(120000);

describe("GET /users/:id/friends", () => {
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

  test(`user can get a list of friends`, async () => {
    expect.assertions(3);

    const response = await streakoid.users.friends.getAll(userId);

    expect(response.status).toEqual(200);
    expect(response.data.friends.length).toEqual(1);
    const friend = response.data.friends[0];
    expect(Object.keys(friend)).toEqual(["username", "_id"]);
  });

  test(`throws GetFriendsUserDoesNotExist error when user does not exist`, async () => {
    expect.assertions(3);

    try {
      await streakoid.users.friends.getAll("5d616c43e1dc592ce8bd487b");
    } catch (err) {
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual("User does not exist.");
      expect(err.response.data.code).toEqual("400-23");
    }
  });
});
