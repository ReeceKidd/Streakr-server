import { resetIncompleteSoloStreaks } from "../../../src/Agenda/resetIncompleteSoloStreaks";
import streakoid from "../../../src/sdk/streakoid";

const registeredUsername = "resetIncompleteSoloStreaksUsername";
const registeredEmail = "resetIncompleteSoloStreaks@gmail.com";

jest.setTimeout(120000);

describe("resetIncompleteSoloStreaks", () => {
  let userId: string;
  let soloStreakId: string;
  const name = "Daily Programming";
  const description = "I will program for one hour everyday";
  const timezone = "America/Louisville";

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
      timezone
    );
    soloStreakId = createSoloStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.soloStreaks.deleteOne(soloStreakId);
  });

  test("that resetIncompleteSoloStreaks updates the current and past values of a streak", async () => {
    expect.assertions(4);

    const incompleteSoloStreaksResponse = await streakoid.soloStreaks.getAll(
      undefined,
      false,
      timezone
    );
    const incompleteSoloStreaks =
      incompleteSoloStreaksResponse.data.soloStreaks;

    const endDate = new Date();
    const resetIncompleteSoloStreaksPromise = await resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      endDate,
      timezone
    );

    await Promise.all(resetIncompleteSoloStreaksPromise);

    const updatedSoloStreakResponse: any = await streakoid.soloStreaks.getOne(
      soloStreakId
    );
    const updatedSoloStreak = updatedSoloStreakResponse.data;

    expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
    expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
    expect(updatedSoloStreak.pastStreaks.length).toBe(1);
    expect(updatedSoloStreak.pastStreaks[0].endDate).toBeDefined();
  });
});
