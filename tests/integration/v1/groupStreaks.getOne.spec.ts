import streakoid from "../../../src/sdk/streakoid";

const email = "get--one-group-streak@gmail.com";
const username = "get-one-group-streak-user";

const streakName = "Daily Meditation";
const streakDescription = "Each day I must meditate at ";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("GET /group-streaks/:groupStreakId", () => {
  let userId: string;

  let groupStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(username, email);
    userId = registrationResponse.data._id;

    const members = [userId];

    const createGroupStreakResponse = await streakoid.groupStreaks.create(
      userId,
      streakName,
      streakDescription,
      members,
      timezone
    );
    groupStreakId = createGroupStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);

    await streakoid.groupStreaks.deleteOne(groupStreakId);
  });

  test(`group streak can be retreived with populated member information`, async () => {
    expect.assertions(10);

    const response = await streakoid.groupStreaks.getOne(groupStreakId);
    const groupStreak = response.data;

    expect(response.status).toEqual(200);
    expect(groupStreak.members.length).toEqual(1);
    expect(groupStreak.streakName).toEqual(streakName);
    expect(groupStreak.streakDescription).toEqual(streakDescription);
    expect(groupStreak.creatorId).toEqual(userId);
    expect(groupStreak.timezone).toEqual(timezone);
    expect(Object.keys(groupStreak)).toEqual([
      "_id",
      "members",
      "creatorId",
      "streakName",
      "streakDescription",
      "timezone",
      "createdAt",
      "updatedAt",
      "__v"
    ]);

    const groupStreakMember = groupStreak.members[0];
    expect(groupStreakMember.username).toEqual(username);
    expect(groupStreakMember.email).toEqual(email);
    expect(Object.keys(groupStreakMember)).toEqual([
      "_id",
      "type",
      "streaks",
      "friends",
      "username",
      "email",
      "createdAt",
      "updatedAt",
      "__v"
    ]);
  });

  test(`sends group streak does not exist error when solo streak doesn't exist`, async () => {
    expect.assertions(5);

    try {
      await streakoid.groupStreaks.getOne("5d54487483233622e43270f9");
    } catch (err) {
      const { code, message, httpStatusCode } = err.response.data;
      expect(err.response.status).toEqual(400);
      expect(code).toEqual("400-25");
      expect(message).toEqual("Group streak does not exist.");
      expect(httpStatusCode).toEqual(400);
      expect(Object.keys(err.response.data)).toEqual([
        "code",
        "message",
        "httpStatusCode"
      ]);
    }
  });
});
