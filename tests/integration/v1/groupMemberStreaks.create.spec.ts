import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-groupMember-streak-user@gmail.com";
const registeredUsername = "create-groupMember-streak-user";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /group-member-streaks", () => {
  let registeredUserId: string;
  let createdGroupStreakId: string;

  const streakName = "Daily Spanish";
  const streakDescription = "Everyday I must do Spanish on Duolingo";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    registeredUserId = registrationResponse.data._id;

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: registeredUserId,
      streakName,
      timezone,
      streakDescription
    });
    createdGroupStreakId = createGroupStreakResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(registeredUserId);
    await streakoid.groupStreaks.deleteOne(createdGroupStreakId);
  });

  test("throws userId does not exist error", () => {});

  test("throws groupStreakId does not exist error", () => {});

  test(`creates groupMember streak associated with groupId`, async () => {
    expect.assertions(13);

    const createGroupMemberStreakResponse = await streakoid.groupMemberStreaks.create(
      registeredUserId,
      createdGroupStreakId,
      timezone
    );

    const {
      userId,
      groupStreakId,
      _id,
      currentStreak,
      completedToday,
      active,
      activity,
      pastStreaks,
      createdAt,
      updatedAt
    } = createGroupMemberStreakResponse.data;

    expect(createGroupMemberStreakResponse.status).toEqual(201);
    expect(userId).toEqual(registeredUserId);
    expect(groupStreakId).toEqual(createdGroupStreakId);
    expect(_id).toBeDefined();
    expect(Object.keys(currentStreak)).toEqual(["numberOfDaysInARow"]);
    expect(currentStreak.numberOfDaysInARow).toEqual(0);
    expect(completedToday).toEqual(false);
    expect(active).toEqual(false);
    expect(activity).toEqual([]);
    expect(pastStreaks).toEqual([]);
    expect(createdAt).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(Object.keys(createGroupMemberStreakResponse.data)).toEqual([
      "currentStreak",
      "completedToday",
      "active",
      "activity",
      "pastStreaks",
      "_id",
      "userId",
      "groupStreakId",
      "timezone",
      "createdAt",
      "updatedAt",
      "__v"
    ]);
  });
});
