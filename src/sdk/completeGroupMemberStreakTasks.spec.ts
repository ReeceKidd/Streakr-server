import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK completeSoloStreakTasks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();
      const userId = "userId";
      const soloStreakId = "soloStreakId";
      const timezone = "timezone";

      await streakoid.completeGroupMemberStreakTasks.create(
        userId,
        soloStreakId,
        timezone
      );

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-group-member-streak-tasks`,
        {
          userId,
          soloStreakId
        },
        {
          headers: {
            "x-timezone": timezone
          }
        }
      );
    });
  });
});
