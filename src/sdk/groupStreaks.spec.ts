import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK groupStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();

      const creatorId = "abcdefgh";
      const groupName = "Weightwatchers London";
      const streakName = "Followed our calorie level";
      const streakDescription = "Stuck to our recommended calorie level";
      const members: string[] = [];
      const timezone = "Europe/London";

      await streakoid.groupStreaks.create(
        creatorId,
        groupName,
        streakName,
        streakDescription,
        members,
        timezone
      );

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks`,
        {
          creatorId,
          groupName,
          streakName,
          streakDescription,
          members
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
