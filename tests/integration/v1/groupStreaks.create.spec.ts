import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-group-streak-user@gmail.com";
const registeredUsername = "create-group-streak-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /group-streaks", () => {
  let userId: string;
  let groupStreakId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.groupStreaks.deleteOne(groupStreakId);
  });

  test(`group streak can be created with description and numberOfMinutes`, async () => {
    expect.assertions(9);

    const streakName = "Reading";
    const streakDescription = "Everyday I must do 30 minutes of reading";
    const numberOfMinutes = 30;
    const members: { memberId: string; groupMemberStreakId?: string }[] = [
      { memberId: userId }
    ];

    const response = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName,
      streakDescription,
      numberOfMinutes,
      members,
      timezone
    });

    expect(response.status).toEqual(201);

    expect(response.data.creatorId).toEqual(userId);
    expect(response.data.streakName).toEqual(streakName);
    expect(response.data.streakDescription).toEqual(streakDescription);
    expect(response.data.numberOfMinutes).toEqual(numberOfMinutes);
    expect(response.data.members).toEqual([
      { memberId: userId, groupMemberStreakId: expect.any(String) }
    ]);
    expect(response.data).toHaveProperty("_id");
    expect(response.data).toHaveProperty("createdAt");
    expect(response.data).toHaveProperty("updatedAt");

    groupStreakId = response.data._id;
  });

  test(`group streak can be created without description or numberOfMinutes`, async () => {
    expect.assertions(9);

    const streakName = "Reading";
    const members = [{ memberId: userId }];

    const response = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName,
      timezone,
      members
    });

    expect(response.status).toEqual(201);
    expect(response.data.creatorId).toEqual(userId);
    expect(response.data.streakName).toEqual(streakName);
    expect(response.data.streakDescription).toBeUndefined();
    expect(response.data.numberOfMinutes).toBeUndefined();
    expect(response.data.members).toEqual([
      { memberId: userId, groupMemberStreakId: expect.any(String) }
    ]);
    expect(response.data).toHaveProperty("_id");
    expect(response.data).toHaveProperty("createdAt");
    expect(response.data).toHaveProperty("updatedAt");

    groupStreakId = response.data._id;
  });
});
