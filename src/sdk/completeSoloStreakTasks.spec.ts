import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK completeSoloStreakTasks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getAll", () => {
    test("calls GET with correct URL when just userId is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.completeSoloStreakTasks.getAll("userId");

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-solo-streak-tasks?userId=userId&`
      );
    });

    test("calls GET with correct URL when just streakId is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.completeSoloStreakTasks.getAll(undefined, "streakId");

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-solo-streak-tasks?streakId=streakId`
      );
    });

    test("calls GET with correct URL when both userId and streakId is passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.completeSoloStreakTasks.getAll("userId", "streakId");

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-solo-streak-tasks?userId=userId&streakId=streakId`
      );
    });

    test("calls GET with correct URL when no query paramaters are passed", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.completeSoloStreakTasks.getAll();

      expect(axios.get).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-solo-streak-tasks?`
      );
    });
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();
      const userId = "userId";
      const soloStreakId = "soloStreakId";
      const timezone = "timezone";

      await streakoid.completeSoloStreakTasks.create(
        userId,
        soloStreakId,
        timezone
      );

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-solo-streak-tasks`,
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

  describe("deleteOne", () => {
    test("calls DELETE correct URL ", async () => {
      expect.assertions(1);
      axios.delete = jest.fn();

      await streakoid.completeSoloStreakTasks.deleteOne("id");

      expect(axios.delete).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-solo-streak-tasks/id`
      );
    });
  });
});
