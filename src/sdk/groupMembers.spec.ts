import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK groupMembers", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();
      const friendId = "friendId";
      const groupStreakId = "groupStreakId";
      const timezone = "timezone";

      await streakoid.groupStreaks.groupMembers.create({
        friendId,
        groupStreakId,
        timezone
      });

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks/groupStreakId/members`,
        {
          friendId
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

      await streakoid.groupStreaks.groupMembers.deleteOne({
        groupStreakId: "groupStreakId",
        memberId: "memberId"
      });

      expect(axios.delete).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks/groupStreakId/members/memberId`
      );
    });
  });
});
