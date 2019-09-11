import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "patch-group-streak-user@gmail.com";
const registeredUsername = "patch-group-streak-user";

const timezone = "Europe/Rome";

jest.setTimeout(120000);

describe(`PATCH /group-streaks`, () => {
  let userId: string;
  let groupStreakId: string;

  const streakName = "Paleo";
  const streakDescription = "I will follow the paleo diet every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const members = [{ memberId: userId }];

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName,
      streakDescription,
      timezone,
      members
    });
    groupStreakId = createGroupStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.groupStreaks.deleteOne(groupStreakId);
  });

  test(`that request passes when group streak is patched with correct keys`, async () => {
    expect.assertions(6);

    const updatedName = "Intermittent fasting";
    const updatedDescription = "Cannot eat till 1pm everyday";

    const response = await streakoid.groupStreaks.update(
      groupStreakId,
      timezone,
      { streakName: updatedName, streakDescription: updatedDescription }
    );

    expect(response.status).toEqual(200);
    expect(response.data.groupStreak.streakName).toEqual(updatedName);
    expect(response.data.groupStreak.streakDescription).toEqual(
      updatedDescription
    );
    expect(response.data.groupStreak).toHaveProperty("_id");
    expect(response.data.groupStreak).toHaveProperty("createdAt");
    expect(response.data.groupStreak).toHaveProperty("updatedAt");
  });
});
