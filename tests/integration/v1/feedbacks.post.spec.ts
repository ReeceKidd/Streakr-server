import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-feedback-user@gmail.com";
const registeredUsername = "create-feedback-user";

jest.setTimeout(120000);

describe("POST /feedbacks", () => {
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

  test(`creates feedback`, async () => {
    expect.assertions(8);

    const feedbackPageUrl = "/solo-streaks";
    const feedbackUsername = "username";
    const feedbackUserEmail = "userEmail";
    const feedbackText = "feedback";

    const response = await streakoid.feedbacks.create(
      registeredUserId,
      feedbackPageUrl,
      feedbackUsername,
      feedbackUserEmail,
      feedbackText
    );

    const {
      _id,
      userId,
      pageUrl,
      username,
      userEmail,
      feedback
    } = response.data;

    expect(response.status).toEqual(201);
    expect(_id).toBeDefined();
    expect(userId).toEqual(registeredUserId);
    expect(pageUrl).toEqual(feedbackPageUrl);
    expect(username).toEqual(feedbackUsername);
    expect(userEmail).toEqual(feedbackUserEmail);
    expect(feedback).toEqual(feedbackText);
    expect(Object.keys(response.data)).toEqual([
      "_id",
      "userId",
      "pageUrl",
      "username",
      "userEmail",
      "feedback",
      "createdAt",
      "updatedAt",
      "__v"
    ]);

    // Remove feedback to maintain clean database
    const feedbackId = response.data._id;
    await streakoid.feedbacks.deleteOne(feedbackId);
  });
});
