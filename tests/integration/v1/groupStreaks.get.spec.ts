import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "get-group-streaks@gmail.com";
const registeredUsername = "get-group-streaks-user";

const groupStreakName = "Daily Spanish";
const groupStreakDescription =
  "Each day I must do the insame amount 50xp of Duolingo";

const timezone = "Europe/Paris";
const londonTimezone = "Europe/London";

jest.setTimeout(120000);

describe("GET /group-streaks", () => {
  let userId: string;
  let creatorId: string;
  let groupStreakId: string;
  let timezoneGroupStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    creatorId = userId;
    const members = [userId];

    const createGroupStreakResponse = await streakoid.groupStreaks.create(
      creatorId,
      groupStreakName,
      groupStreakDescription,
      members,
      timezone
    );
    groupStreakId = createGroupStreakResponse.data._id;

    const specificTimezoneGroupStreakResponse = await streakoid.groupStreaks.create(
      userId,
      groupStreakName,
      groupStreakDescription,
      [],
      londonTimezone
    );

    timezoneGroupStreakId = specificTimezoneGroupStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.groupStreaks.deleteOne(groupStreakId);
    await streakoid.groupStreaks.deleteOne(timezoneGroupStreakId);
  });

  test(`that group streaks can be retreived with memberId query parameter`, async () => {
    expect.assertions(11);

    const response = await streakoid.groupStreaks.getAll(userId);
    const groupStreak = response.data.groupStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.members.length).toEqual(1);
    expect(groupStreak.streakName).toEqual(groupStreakName);
    expect(groupStreak.streakDescription).toEqual(groupStreakDescription);
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
    expect(groupStreakMember.username).toEqual(registeredUsername);
    expect(groupStreakMember.email).toEqual(registeredEmail);
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

  test(`that group streaks can be retreieved with timezone query parameter`, async () => {
    expect.assertions(11);

    const response = await streakoid.groupStreaks.getAll(
      undefined,
      undefined,
      timezone
    );
    const groupStreak = response.data.groupStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.members.length).toEqual(0);
    expect(groupStreak.streakName).toEqual(groupStreakName);
    expect(groupStreak.streakDescription).toEqual(groupStreakDescription);
    expect(groupStreak.creatorId).toEqual(userId);
    expect(groupStreak.timezone).toEqual(londonTimezone);
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
  });
});
