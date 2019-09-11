import streakoid from "../../../src/sdk/streakoid";

const registeredEmail =
  "delete-complete-group-member-streak-tasks-user@gmail.com";
const registeredUsername = "delete-complete-group-member-streak-tasks-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("DELETE /complete-group-member-streak-tasks", () => {
  let userId: string;
  let groupStreakId: string;
  let groupMemberStreakId: string;
  let completeGroupMemberStreakTaskId: string;

  const streakName = "Intermittent fasting";
  const streakDescription = "I will not eat until 1pm everyday";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;
    const members = [{ memberId: userId }];

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName,
      streakDescription,
      timezone,
      members
    });
    groupStreakId = createGroupStreakResponse.data._id;

    const createGroupMemberStreakResponse = await streakoid.groupMemberStreaks.create(
      userId,
      groupStreakId,
      timezone
    );
    groupMemberStreakId = createGroupMemberStreakResponse.data._id;

    const completeGroupMemberStreakTaskResponse = await streakoid.completeGroupMemberStreakTasks.create(
      userId,
      groupStreakId,
      groupMemberStreakId,
      timezone
    );
    completeGroupMemberStreakTaskId =
      completeGroupMemberStreakTaskResponse.data.completeGroupMemberStreakTask
        ._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.groupStreaks.deleteOne(groupStreakId);
  });

  describe("DELETE /v1/complete-group-member-streak-tasks", () => {
    test("deletes complete-group-member-streak-tasks", async () => {
      expect.assertions(1);

      const response = await streakoid.completeGroupMemberStreakTasks.deleteOne(
        completeGroupMemberStreakTaskId
      );

      expect(response.status).toEqual(204);
    });
  });
});
