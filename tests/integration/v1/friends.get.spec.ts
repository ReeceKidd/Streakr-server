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
    try {
      console.log(`UserId: ${userId}`);
      expect.assertions(3);
      const response = await streakoid.users.friends.getAll(userId);

      console.log(response.data);

      expect(response.status).toEqual(200);
      expect(response.data.friends.length).toEqual(1);
    } catch (err) {
      console.log("Entered error");
      console.log(err);
    }
  });
});
