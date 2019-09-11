import streakoid from "../../../src/sdk/streakoid";
import { StreakTypes } from "../../../src/Models/TypesOfStreak";

const email = "get-complete-group-member-task@gmail.com";
const username = "get-complete-group-member-task";

const streakName = "10 minutes journaling";
const streakDescription = "Each day I must do 10 minutes journaling";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("GET /complete-group-member-streak-tasks", () => {
  let userId: string;
  let groupStreakId: string;
  let groupMemberStreakId: string;
  let completeGroupMemberStreakTaskId: string;

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(username, email);
    userId = registrationResponse.data._id;
    const members = [{ memberId: userId }];

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: userId,
      streakName,
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

    const createGroupMemberStreakTaskCompleteResponse = await streakoid.completeGroupMemberStreakTasks.create(
      userId,
      groupStreakId,
      groupMemberStreakId,
      timezone
    );
    completeGroupMemberStreakTaskId =
      createGroupMemberStreakTaskCompleteResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);
    await streakoid.groupStreaks.deleteOne(groupStreakId);
    await streakoid.groupMemberStreaks.deleteOne(groupMemberStreakId);
    await streakoid.completeGroupMemberStreakTasks.deleteOne(
      completeGroupMemberStreakTaskId
    );
  });

  test(`completeGroupMemberStreakTasks can be retreived`, async () => {
    expect.assertions(12);

    const response = await streakoid.completeGroupMemberStreakTasks.getAll({
      userId,
      groupStreakId,
      groupMemberStreakId
    });

    expect(response.status).toEqual(200);

    const { completeGroupMemberStreakTasks } = response.data;

    expect(Object.keys(response.data)).toEqual([
      "completeGroupMemberStreakTasks"
    ]);

    const completeGroupMemberStreakTask = completeGroupMemberStreakTasks[0];

    expect(completeGroupMemberStreakTask._id).toBeDefined();
    expect(completeGroupMemberStreakTask.userId).toEqual(userId);
    expect(completeGroupMemberStreakTask.groupStreakId).toEqual(groupStreakId);
    expect(completeGroupMemberStreakTask.groupMemberStreakId).toEqual(
      groupMemberStreakId
    );
    expect(completeGroupMemberStreakTask.taskCompleteTime).toEqual(
      expect.any(String)
    );
    expect(completeGroupMemberStreakTask.taskCompleteDay).toEqual(
      expect.any(String)
    );
    expect(completeGroupMemberStreakTask.streakType).toEqual(
      StreakTypes.groupMemberStreak
    );
    expect(completeGroupMemberStreakTask.createdAt).toBeDefined();
    expect(completeGroupMemberStreakTask.updatedAt).toBeDefined();
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
  });
});
