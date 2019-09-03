import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK soloStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();
      const type = StreakTrackingEventType.LostStreak;
      const streakId = "streakId";
      const userId = "userId";

      await streakoid.streakTrackingEvents.create(type, streakId, userId);

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/streak-tracking-events`,
        {
          type,
          streakId,
          userId
        }
      );
    });
  });
});
