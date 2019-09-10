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
      const groupStreakId = "groupStreakId";
      const groupMemberStreakId = "groupMemberStreakId";
      const timezone = "timezone";

      await streakoid.completeGroupMemberStreakTasks.create(
        userId,
        groupStreakId,
        groupMemberStreakId,
        timezone
      );

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-group-member-streak-tasks`,
        {
          userId,
          groupStreakId,
          groupMemberStreakId
        },
        {
          headers: {
            "x-timezone": timezone
          }
        }
      );
    });
  });

  describe("deleteOne", () => {
    test("calls DELETE correct URL ", async () => {
      expect.assertions(1);
      axios.delete = jest.fn();

      await streakoid.completeGroupMemberStreakTasks.deleteOne("id");

      expect(axios.delete).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-group-member-streak-tasks/id`
      );
    });
  });
});
