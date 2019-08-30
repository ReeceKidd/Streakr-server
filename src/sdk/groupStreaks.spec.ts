import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK groupStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getAll", () => {
    test("calls GET with correct URL when no query paramters are passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.groupStreaks.getAll();

      expect(axios.get).toBeCalledWith(`${APPLICATION_URL}/v1/group-streaks?`);
    });

    test("calls GET with correct URL when memberId query paramater is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      const memberId = "memberId";

      await streakoid.groupStreaks.getAll(memberId);

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks?memberId=${memberId}&`
      );
    });

    test("calls GET with correct URL when completedToday query paramater is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      const completedToday = true;

      await streakoid.groupStreaks.getAll(undefined, completedToday);

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks?completedToday=true&`
      );
    });

    test("calls GET with correct URL when timezone query paramater is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      const timezone = `Europe/London`;

      await streakoid.groupStreaks.getAll(undefined, undefined, timezone);

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks?timezone=${timezone}`
      );
    });
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();

      const creatorId = "abcdefgh";
      const streakName = "Followed our calorie level";
      const streakDescription = "Stuck to our recommended calorie level";
      const members: string[] = [];
      const timezone = "Europe/London";

      await streakoid.groupStreaks.create(
        creatorId,
        streakName,
        streakDescription,
        members,
        timezone
      );

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks`,
        {
          creatorId,
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

  describe("deleteOne", () => {
    test("calls DELETE correct URL ", async () => {
      expect.assertions(1);
      axios.delete = jest.fn();

      await streakoid.groupStreaks.deleteOne("id");

      expect(axios.delete).toBeCalledWith(
        `${APPLICATION_URL}/v1/group-streaks/id`
      );
    });
  });
});
