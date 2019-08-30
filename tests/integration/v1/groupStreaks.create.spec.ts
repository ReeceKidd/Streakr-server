import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-group-streak-user@gmail.com";
const registeredUsername = "create-group-streak-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /group-streaks", () => {
  let userId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test(`group streak can be created with no members`, async () => {
    expect.assertions(8);

    const creatorId = userId;
    const streakName = "30 minutes of reading";
    const streakDescription = "Everyday I must do 30 minutes of reading";
    const members: string[] = [];

    const response = await streakoid.groupStreaks.create(
      creatorId,
      streakName,
      streakDescription,
      members,
      timezone
    );

    expect(response.status).toEqual(201);
    expect(response.data.creatorId).toEqual(creatorId);
    expect(response.data.streakName).toEqual(streakName);
    expect(response.data.streakDescription).toEqual(streakDescription);
    expect(response.data.members).toEqual([]);
    expect(response.data).toHaveProperty("_id");
    expect(response.data).toHaveProperty("createdAt");
    expect(response.data).toHaveProperty("updatedAt");

    // // Remove created solo streak to maintain clean database
    // const soloStreakId = response.data._id;
    // await streakoid.soloStreaks.deleteOne(soloStreakId);
  });
});
