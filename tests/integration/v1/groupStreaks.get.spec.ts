import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "get-group-streaks@gmail.com";
const registeredUsername = "get-group-streaks-user";

const creatorRegisteredEmail = "creator@gmail.com";
const creatorRegisteredUsername = "creator";

const creatorIdStreakName = "Daily Spanish";
const creatorIdStreakDescription =
  "Each day I must do the insame amount 50xp of Duolingo";

const memberIdStreakName = "Read 30 minutes";
const memberIdStreakDescription = "Everyday we must read for 30 minutes";

const timezoneStreakName = "Cold showers";
const timezoneStreakDescription =
  "Every day I must take cold showers for one minutes";

const timezone = "Europe/Paris";
const romeTimezone = "Europe/Rome";

jest.setTimeout(120000);

describe("GET /group-streaks", () => {
  let userId: string;
  let creatorId: string;
  let creatorIdGroupStreakId: string;
  let memberIdGroupStreakId: string;
  let timezoneGroupStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const creatorRegistrationResponse = await streakoid.users.create(
      creatorRegisteredUsername,
      creatorRegisteredEmail
    );
    creatorId = creatorRegistrationResponse.data._id;

    const members = [userId];

    const creatorIdGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId,
      streakName: creatorIdStreakName,
      streakDescription: creatorIdStreakDescription,
      timezone
    });
    creatorIdGroupStreakId = creatorIdGroupStreakResponse.data._id;

    const memberIdGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName: memberIdStreakName,
      streakDescription: memberIdStreakDescription,
      members,
      timezone
    });
    memberIdGroupStreakId = memberIdGroupStreakResponse.data._id;

    const specificTimezoneGroupStreakResponse = await streakoid.groupStreaks.create(
      {
        creatorId: userId,
        streakName: timezoneStreakName,
        streakDescription: timezoneStreakDescription,
        timezone: romeTimezone
      }
    );

    timezoneGroupStreakId = specificTimezoneGroupStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.users.deleteOne(creatorId);

    await streakoid.groupStreaks.deleteOne(creatorIdGroupStreakId);
    await streakoid.groupStreaks.deleteOne(memberIdGroupStreakId);
    await streakoid.groupStreaks.deleteOne(timezoneGroupStreakId);
  });

  test(`group streaks can be retreived with creatorId query paramater`, async () => {
    const response = await streakoid.groupStreaks.getAll({ creatorId });
    const groupStreak = response.data.groupStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.members.length).toEqual(0);
    expect(groupStreak.streakName).toEqual(creatorIdStreakName);
    expect(groupStreak.streakDescription).toEqual(creatorIdStreakDescription);
    expect(groupStreak.creatorId).toEqual(creatorId);
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
  });

  test(`group streaks can be retreived with memberId query parameter`, async () => {
    expect.assertions(11);

    const response = await streakoid.groupStreaks.getAll({ memberId: userId });
    const groupStreak = response.data.groupStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toEqual(1);
    expect(groupStreak.members.length).toEqual(1);
    expect(groupStreak.streakName).toEqual(memberIdStreakName);
    expect(groupStreak.streakDescription).toEqual(memberIdStreakDescription);
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

  test(`group streaks can be retreieved with timezone query parameter`, async () => {
    expect.assertions(8);

    const response = await streakoid.groupStreaks.getAll({
      timezone: romeTimezone
    });
    const groupStreak = response.data.groupStreaks[0];

    expect(response.status).toEqual(200);
    expect(response.data.groupStreaks.length).toBeGreaterThanOrEqual(1);
    expect(groupStreak.members.length).toEqual(0);
    expect(groupStreak.streakName).toEqual(timezoneStreakName);
    expect(groupStreak.streakDescription).toEqual(timezoneStreakDescription);
    expect(groupStreak.creatorId).toEqual(userId);
    expect(groupStreak.timezone).toEqual(romeTimezone);
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
