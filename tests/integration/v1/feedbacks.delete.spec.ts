import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-feedback-user@gmail.com";
const registeredUsername = "delete-feedback-user";

jest.setTimeout(120000);

describe("DELETE /feedbacks/:feedbackId", () => {
  let registeredUserId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    registeredUserId = registrationResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(registeredUserId);
  });

  test(`deletes feedback`, async () => {
    expect.assertions(1);

    const feedbackPageUrl = "/solo-streaks";
    const feedbackUsername = "username";
    const feedbackUserEmail = "userEmail";
    const feedbackText = "feedback";

    const createFeedbackResponse = await streakoid.feedbacks.create(
      registeredUserId,
      feedbackPageUrl,
      feedbackUsername,
      feedbackUserEmail,
      feedbackText
    );

    const { _id } = createFeedbackResponse.data;

    try {
      const response = await streakoid.feedbacks.deleteOne(_id);
      expect(response.status).toEqual(204);
    } catch (err) {
      console.log(err);
    }
  });
});
