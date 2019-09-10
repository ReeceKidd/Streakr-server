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

      const userId = "12345678";
      const pageUrl = "/solo-streaks";
      const username = "username";
      const userEmail = "userEmail";
      const feedback = "feedback";

      await streakoid.feedbacks.create(
        userId,
        pageUrl,
        username,
        userEmail,
        feedback
      );

      expect(axios.post).toBeCalledWith(`${APPLICATION_URL}/v1/feedbacks`, {
        userId,
        pageUrl,
        username,
        userEmail,
        feedback
      });
    });
  });

  describe("deleteOne", () => {
    test("calls DELETE correct URL ", async () => {
      expect.assertions(1);
      axios.delete = jest.fn();

      await streakoid.feedbacks.deleteOne("id");

      expect(axios.delete).toBeCalledWith(`${APPLICATION_URL}/v1/feedbacks/id`);
    });
  });
});
