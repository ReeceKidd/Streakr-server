import streakoid from "../../../src/sdk/streakoid";
import { CompleteGroupMemberStreakTask } from "../../../src/Models/CompleteGroupMemberStreakTask";

const registeredEmail =
  "create-complete-group-member-streak-tasks-user@gmail.com";
const registeredUsername = "create-complete-group-member-streak-tasks-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /complete-group-member-streak-tasks", () => {
  let userId: string;
  let groupStreakId: string;
  let groupMemberStreakId: string;
  let secondGroupMemberStreakId: string;

  const streakName = "Intermittent fasting";
  const streakDescription = "I will not eat until 1pm everyday";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    userId = registrationResponse.data._id;

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName,
      streakDescription,
      timezone
    });
    groupStreakId = createGroupStreakResponse.data._id;

    const createGroupMemberStreakResponse = await streakoid.groupMemberStreaks.create(
      userId,
      groupStreakId,
      timezone
    );
    groupMemberStreakId = createGroupMemberStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.groupStreaks.deleteOne(groupStreakId);
  });

  describe("POST /v1/complete-group-member-streak-tasks", () => {
    test("user can say that a group streak member task has been completed for the day", async () => {
      expect.assertions(12);

      const completeGroupMemberStreakTaskResponse = await streakoid.completeGroupMemberStreakTasks.create(
        userId,
        groupStreakId,
        groupMemberStreakId,
        timezone
      );
      const {
        completeGroupMemberStreakTask
      } = completeGroupMemberStreakTaskResponse.data;

      expect(completeGroupMemberStreakTaskResponse.status).toEqual(201);
      expect(completeGroupMemberStreakTask._id).toBeDefined();
      expect(completeGroupMemberStreakTask.taskCompleteTime).toEqual(
        expect.any(String)
      );
      expect(completeGroupMemberStreakTask.userId).toEqual(userId);
      expect(completeGroupMemberStreakTask.groupStreakId).toEqual(
        groupStreakId
      );
      expect(completeGroupMemberStreakTask.groupMemberStreakId).toEqual(
        groupMemberStreakId
      );

      expect(Object.keys(completeGroupMemberStreakTask)).toEqual([
        "_id",
        "userId",
        "groupStreakId",
        "groupMemberStreakId",
        "taskCompleteTime",
        "taskCompleteDay",
        "streakType",
        "createdAt",
        "updatedAt",
        "__v"
      ]);

      const groupMemberStreakResponse = await streakoid.groupMemberStreaks.getOne(
        groupMemberStreakId
      );

      groupMemberStreakId = groupMemberStreakResponse.data._id;
      const groupMemberStreak = groupMemberStreakResponse.data;

      expect(groupMemberStreak.currentStreak.startDate).toBeDefined();
      expect(groupMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
      expect(Object.keys(groupMemberStreak.currentStreak)).toEqual([
        "startDate",
        "numberOfDaysInARow"
      ]);
      expect(groupMemberStreak.completedToday).toEqual(true);
      expect(groupMemberStreak.active).toEqual(true);
    });

    test("user cannot complete the same group streak member task in the same day", async () => {
      expect.assertions(3);

      const secondGroupMemberStreakResponse = await streakoid.groupMemberStreaks.create(
        userId,
        groupStreakId,
        timezone
      );
      secondGroupMemberStreakId = secondGroupMemberStreakResponse.data._id;

      try {
        await streakoid.completeGroupMemberStreakTasks.create(
          userId,
          groupStreakId,
          secondGroupMemberStreakId,
          timezone
        );
        await streakoid.completeGroupMemberStreakTasks.create(
          userId,
          groupStreakId,
          secondGroupMemberStreakId,
          timezone
        );
      } catch (err) {
        expect(err.response.status).toEqual(422);
        expect(err.response.data.message).toEqual(
          "Task already completed today."
        );
        expect(err.response.data.code).toEqual("422-02");
      }
    });
  });
});
