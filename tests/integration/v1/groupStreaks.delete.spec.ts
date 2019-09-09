import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-group-streak-user@gmail.com";
const registeredUsername = "delete-group-streak-user";

const timezone = "Europe/Budapest";

jest.setTimeout(120000);

describe(`DELETE /group-streaks`, () => {
  let userId: string;
  let groupStreakId: string;

  const name = "Reading";
  const description = "I will read 30 minutes every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
    const creatorId = userId;
    const members: string[] = [userId];

    const createSoloStreakResponse = await streakoid.groupStreaks.create({
      creatorId,
      streakName: name,
      streakDescription: description,
      members,
      timezone
    });
    groupStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test(`that group streak can be deleted`, async () => {
    expect.assertions(1);

    const response = await streakoid.groupStreaks.deleteOne(groupStreakId);

    expect(response.status).toEqual(204);
  });
});
