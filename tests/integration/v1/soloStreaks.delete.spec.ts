import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-solo-streak-user@gmail.com";
const registeredUsername = "delete-solo-streak-user";

const budapestTimezone = "Europe/Budapest";

jest.setTimeout(120000);

describe(`DELETE solo-streaks`, () => {
  let userId: string;
  let soloStreakId: string;

  const name = "Reading";
  const description = "I will read 30 minutes every day";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      name,
      description,
      budapestTimezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
  });

  test(`that solo streak can be deleted`, async () => {
    expect.assertions(1);

    const response = await streakoid.soloStreaks.deleteOne(soloStreakId);

    expect(response.status).toEqual(204);
  });
});
