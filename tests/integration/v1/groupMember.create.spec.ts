import streakoid from "../../../src/sdk/streakoid";

const registeredEmail = "create-groupMember-user@gmail.com";
const registeredUsername = "create-groupMember-user";

const friendEmail = "friend@gmail.com";
const friendUsername = "friendUser";

const timezone = "Europe/London";

jest.setTimeout(120000);

describe("POST /group-streaks/:id/members", () => {
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
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(registeredUserId);
    await streakoid.users.deleteOne(friendId);
    await streakoid.groupStreaks.deleteOne(createdGroupStreakId);
  });

  test(`adds friend to group streak`, async () => {
    expect.assertions(9);

    const addFriendToGroupStreakResponse = await streakoid.groupStreaks.groupMembers.create(
      { friendId, groupStreakId: createdGroupStreakId, timezone }
    );

    const { data } = addFriendToGroupStreakResponse;
    expect(Object.keys(data)).toEqual(["members"]);

    const { members } = data;

    expect(members.length).toEqual(2);

    const currentUser = members[0];
    expect(currentUser.memberId).toEqual(registeredUserId);
    expect(currentUser.groupMemberStreakId).toEqual(expect.any(String));
    expect(Object.keys(currentUser)).toEqual([
      "memberId",
      "groupMemberStreakId"
    ]);

    const friend = members[1];
    expect(friend.memberId).toEqual(friendId);
    expect(friend.groupMemberStreakId).toEqual(expect.any(String));
    expect(Object.keys(currentUser)).toEqual([
      "memberId",
      "groupMemberStreakId"
    ]);

    const updatedGroupStreakResponse = await streakoid.groupStreaks.getOne(
      createdGroupStreakId
    );

    const groupStreak = updatedGroupStreakResponse.data;

    expect(groupStreak.members.length).toEqual(2);
  });
});
