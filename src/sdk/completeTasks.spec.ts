import axios from "axios";
import streakoid from "./streakoid";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

describe("SDK completeTasks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getAll", () => {
    test("calls GET with correct URL and query paramater", async () => {
      expect.assertions(1);
      axios.get = jest.fn();

      await streakoid.completeTasks.getAll();

      expect(axios.get).toBeCalledWith(`${APPLICATION_URL}/v1/complete-tasks`);
    });
  });

  describe("create", () => {
    test("calls POST with correct URL and data parmaters", async () => {
      expect.assertions(1);
      axios.post = jest.fn();
      const userId = "userId";
      const streakId = "streakId";

      await streakoid.completeTasks.create(userId, streakId);

      expect(axios.post).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-tasks`,
        {
          userId,
          streakId
        }
      );
    });
  });

  describe("deleteOne", () => {
    test("calls DELETE correct URL ", async () => {
      expect.assertions(1);
      axios.delete = jest.fn();

      await streakoid.completeTasks.deleteOne("id");

      expect(axios.delete).toBeCalledWith(
        `${APPLICATION_URL}/v1/complete-tasks/id`
      );
    });
  });
});
