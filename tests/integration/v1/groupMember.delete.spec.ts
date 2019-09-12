import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-groupMember-user@gmail.com";
const registeredUsername = "create-groupMember-user";

const friendEmail = "friend@gmail.com";
const friendUsername = "friendUser";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("DELETE /group-streaks/:id/members/:id", () => {
  let registeredUserId: string;
  let friendId: string;
  let createdGroupStreakId: string;

  const streakName = "Drink water";
  const streakDescription = "Everyday I must drink two litres of water";

  beforeAll(async () => {
    const registrationResponse = await streakoid.users.create(
      registeredUsername,
      registeredEmail
    );
    registeredUserId = registrationResponse.data._id;

    const friendRegistrationResponse = await streakoid.users.create(
      friendUsername,
      friendEmail
    );

    friendId = friendRegistrationResponse.data._id;

    const members = [{ memberId: registeredUserId }];

    const createGroupStreakResponse = await streakoid.groupStreaks.create({
      creatorId: registeredUserId,
      streakName,
      timezone,
      streakDescription,
      members
    });
    createdGroupStreakId = createGroupStreakResponse.data._id;

    await streakoid.groupStreaks.groupMembers.create({
      friendId,
      groupStreakId: createdGroupStreakId,
      timezone
    });
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(registeredUserId);
    await streakoid.users.deleteOne(friendId);
    await streakoid.groupStreaks.deleteOne(createdGroupStreakId);
  });

  test(`deletes member from group streak`, async () => {
    expect.assertions(2);

    const response = await streakoid.groupStreaks.groupMembers.deleteOne({
      groupStreakId: createdGroupStreakId,
      memberId: friendId
    });

    expect(response.status).toEqual(204);

    const updatedGroupStreakResponse = await streakoid.groupStreaks.getOne(
      createdGroupStreakId
    );

    const updatedGroupStreak = updatedGroupStreakResponse.data;

    const { members } = updatedGroupStreak;

    expect(members.length).toEqual(1);
  });
});
