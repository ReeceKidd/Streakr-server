import { soloStreakModel, SoloStreak } from "../../../src/Models/SoloStreak";
import { getIncompleteSoloStreaks } from "../../../src/Agenda/getIncompleteSoloStreaks";
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
    expect.assertions(3);
    /*
        Have to force soloStreak to have new date because streaks without a new date aren't
        considered incomplete as they haven't been started
        */
    await soloStreakModel.findByIdAndUpdate(soloStreakId, {
      currentStreak: { startDate: new Date() }
    });
    const incompleteSoloStreaks = await getIncompleteSoloStreaks(timezone);
    const endDate = new Date();
    const resetIncompleteSoloStreaksPromise = await resetIncompleteSoloStreaks(
      incompleteSoloStreaks,
      endDate
    );
    await Promise.all(resetIncompleteSoloStreaksPromise);
    const updatedSoloStreak = (await soloStreakModel.findById(
      soloStreakId
    )) as SoloStreak;

    expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
    expect(updatedSoloStreak.pastStreaks.length).toBe(1);
    expect(updatedSoloStreak.pastStreaks[0].endDate).toEqual(endDate);
  });
});
