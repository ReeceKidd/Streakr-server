import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "delete-groupMember-streak-user@gmail.com";
const registeredUsername = "delete-groupMember-streak-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("DELETE /group-member-streaks", () => {
  let registeredUserId: string;
  let createdGroupStreakId: string;
  let createGroupMemberStreakId: string;

  const streakName = "Daily Spanish";
  const streakDescription = "Everyday I must do Spanish on Duolingo";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    registeredUserId = registrationResponse.data._id;

    const members = [{ memberId: registeredUserId }];

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: registeredUserId,
      streakName,
      timezone,
      streakDescription,
      members
    });
    createdGroupStreakId = createGroupStreakResponse.data._id;

    const createGroupMemberStreakResponse = await streakoid.groupMemberStreaks.create(
      registeredUserId,
      createdGroupStreakId,
      timezone
    );

    createGroupMemberStreakId = createGroupMemberStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(registeredUserId);
    await streakoid.groupStreaks.deleteOne(createdGroupStreakId);
  });

  test(`deletes groupMember streak`, async () => {
    expect.assertions(1);

    const response = await streakoid.groupMemberStreaks.deleteOne(
      createGroupMemberStreakId
    );
    expect(response.status).toEqual(204);
  });
});
