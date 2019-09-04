import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK soloStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getAll", () => {
    test("calls GET with correct URL when no query paramters are passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.soloStreaks.getAll({});

      expect(axios.get).toBeCalledWith(`${APPLICATION_URL}/v1/solo-streaks?`);
    });

    test("calls GET with correct URL when userId query paramater is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      const userId = "userId";

      await streakoid.soloStreaks.getAll({ userId });

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/solo-streaks?userId=${userId}&`
      );
    });

    test("calls GET with correct URL when completedToday query paramater is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      const completedToday = true;

      await streakoid.soloStreaks.getAll({ completedToday });

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/solo-streaks?completedToday=true&`
      );
    });

    test("calls GET with correct URL when timezone query paramater is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      const timezone = `Europe/London`;

      await streakoid.soloStreaks.getAll({ timezone });

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/solo-streaks?timezone=${timezone}`
      );
    });
  });

  describe("getOne", () => {
    test("calls GET with correct URL", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.soloStreaks.getOne("id");

      expect(axios.get).toBeCalledWith(`${APPLICATION_URL}/v1/solo-streaks/id`);
    });
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();
      const userId = "userId";
      const name = "name";
      const description = "descrption";
      const timezone = "timezone";

      await streakoid.soloStreaks.create(userId, name, description, timezone);

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/solo-streaks`,
        {
          userId,
          name,
          description
        },
        {
          headers: {
            "x-timezone": timezone
          }
        }
      );
    });
  });

  describe("update", () => {
    test("calls PATCH with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.patch = jest.fn();
      const name = "name";
      const description = "description";
      const data = {
        name,
        description,
        activity: []
      };
      const timezone = "timezone";

      await streakoid.soloStreaks.update("id", timezone, data);

      expect(axios.patch).toBeCalledWith(
        `${APPLICATION_URL}/v1/solo-streaks/id`,
        {
          ...data
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

      await streakoid.soloStreaks.deleteOne("id");

      expect(axios.delete).toBeCalledWith(
        `${APPLICATION_URL}/v1/solo-streaks/id`
      );
    });
  });
});
