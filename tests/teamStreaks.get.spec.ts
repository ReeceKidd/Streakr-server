// import { StreakoidFactory, londonTimezone } from '../src/streakoid';
// import { streakoidTest } from './setup/streakoidTest';
// import { getPayingUser } from './setup/getPayingUser';
// import { isTestEnvironment } from './setup/isTestEnvironment';
// import { setUpDatabase } from './setup/setupDatabase';
// import { tearDownDatabase } from './setup/tearDownDatabase';
// import { GetAllTeamStreaksSortFields } from '../src/teamStreaks';
// import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
// import { getServiceConfig } from '../getServiceConfig';

// const username = getServiceConfig().USER;
// const originalImageUrl = getServiceConfig().ORIGINAL_IMAGE_URL;

// jest.setTimeout(120000);

// describe('GET /complete-solo-streak-tasks', () => {
//     let streakoid: StreakoidFactory;
//     let creatorId: string;
//     let teamStreakId: string;
//     const streakName = 'Daily Spanish';

//     beforeAll(async () => {
//         if (isTestEnvironment()) {
//             await setUpDatabase();
//             const user = await getPayingUser();
//             creatorId = user._id;
//             streakoid = await streakoidTest();
//             const members = [{ memberId: creatorId }];

//             const teamStreak = await streakoid.teamStreaks.create({
//                 creatorId,
//                 streakName,
//                 members,
//             });
//             teamStreakId = teamStreak._id;

//             await streakoid.teamStreaks.create({
//                 creatorId,
//                 streakName,
//                 members,
//             });

//             await streakoid.teamStreaks.create({
//                 creatorId,
//                 streakName,
//                 members,
//             });
//         }
//     });

//     afterAll(async () => {
//         if (isTestEnvironment()) {
//             await tearDownDatabase();
//         }
//     });

//     test(`team streaks can be retrieved with creatorId query paramter`, async () => {
//         expect.assertions(18);

//         const teamStreaks = await streakoid.teamStreaks.getAll({ creatorId });
//         expect(teamStreaks.length).toBeGreaterThanOrEqual(1);

//         const teamStreak = teamStreaks[0];
//         expect(teamStreak.streakName).toEqual(expect.any(String));
//         expect(teamStreak.status).toEqual(StreakStatus.live);
//         expect(teamStreak.creatorId).toBeDefined();
//         expect(teamStreak.timezone).toEqual(expect.any(String));
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'members',
//                 'status',
//                 'creatorId',
//                 'streakName',
//                 'timezone',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { members } = teamStreak;
//         expect(members.length).toEqual(1);

//         const member = members[0];
//         expect(member._id).toBeDefined();
//         expect(member.username).toEqual(username);
//         expect(member.profileImage).toEqual(originalImageUrl);
//         expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

//         const { teamMemberStreak } = member;
//         expect(Object.keys(teamMemberStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'currentStreak',
//                 'completedToday',
//                 'active',
//                 'pastStreaks',
//                 'userId',
//                 'teamStreakId',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { currentStreak } = teamMemberStreak;
//         expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
//     });

//     test('returns no team streaks when invalid creatorId is used', async () => {
//         expect.assertions(1);
//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             creatorId: 'InvalidID',
//         });
//         expect(teamStreaks.length).toEqual(0);
//     });

//     test(`team streaks can be retrieved with memberId query parameter`, async () => {
//         expect.assertions(18);
//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             memberId: creatorId,
//         });
//         expect(teamStreaks.length).toBeGreaterThanOrEqual(1);
//         const teamStreak = teamStreaks[0];
//         expect(teamStreak.streakName).toEqual(expect.any(String));
//         expect(teamStreak.status).toEqual(StreakStatus.live);
//         expect(teamStreak.creatorId).toBeDefined();
//         expect(teamStreak.timezone).toEqual(expect.any(String));
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'members',
//                 'status',
//                 'creatorId',
//                 'streakName',
//                 'timezone',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { members } = teamStreak;
//         expect(members.length).toEqual(1);

//         const member = members[0];
//         expect(member._id).toBeDefined();
//         expect(member.username).toEqual(username);
//         expect(member.profileImage).toEqual(originalImageUrl);
//         expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

//         const { teamMemberStreak } = member;
//         expect(Object.keys(teamMemberStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'currentStreak',
//                 'completedToday',
//                 'active',
//                 'pastStreaks',
//                 'userId',
//                 'teamStreakId',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { currentStreak } = teamMemberStreak;
//         expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
//     });

//     test('returns no team streaks when invalid memberId is used', async () => {
//         expect.assertions(1);
//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             memberId: 'InvalidID',
//         });
//         expect(teamStreaks.length).toEqual(0);
//     });

//     test(`team streaks can be retreieved with timezone query parameter`, async () => {
//         expect.assertions(18);
//         const teamStreaks = await streakoid.teamStreaks.getAll({ timezone: londonTimezone });

//         expect(teamStreaks.length).toBeGreaterThanOrEqual(1);

//         const teamStreak = teamStreaks[0];
//         expect(teamStreak.streakName).toEqual(expect.any(String));
//         expect(teamStreak.status).toEqual(expect.any(String));
//         expect(teamStreak.creatorId).toEqual(expect.any(String));
//         expect(teamStreak.timezone).toEqual(expect.any(String));
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'members',
//                 'status',
//                 'creatorId',
//                 'streakName',
//                 'timezone',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { members } = teamStreak;
//         expect(members.length).toEqual(1);

//         const member = members[0];
//         expect(member._id).toBeDefined();
//         expect(member.username).toEqual(expect.any(String));
//         expect(member.profileImage).toEqual(originalImageUrl);
//         expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

//         const { teamMemberStreak } = member;
//         expect(Object.keys(teamMemberStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'currentStreak',
//                 'completedToday',
//                 'active',
//                 'pastStreaks',
//                 'userId',
//                 'teamStreakId',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { currentStreak } = teamMemberStreak;
//         expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
//     });

//     test(`team streaks can be retreieved using sortField query parameter`, async () => {
//         expect.assertions(18);
//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             sortField: GetAllTeamStreaksSortFields.currentStreak,
//         });

//         expect(teamStreaks.length).toBeGreaterThanOrEqual(1);

//         const teamStreak = teamStreaks[0];
//         expect(teamStreak.streakName).toEqual(expect.any(String));
//         expect(teamStreak.status).toEqual(expect.any(String));
//         expect(teamStreak.creatorId).toEqual(expect.any(String));
//         expect(teamStreak.timezone).toEqual(expect.any(String));
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'members',
//                 'status',
//                 'creatorId',
//                 'streakName',
//                 'timezone',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { members } = teamStreak;
//         expect(members.length).toEqual(1);

//         const member = members[0];
//         expect(member._id).toBeDefined();
//         expect(member.username).toEqual(expect.any(String));
//         expect(member.profileImage).toEqual(originalImageUrl);
//         expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

//         const { teamMemberStreak } = member;
//         expect(Object.keys(teamMemberStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'currentStreak',
//                 'completedToday',
//                 'active',
//                 'pastStreaks',
//                 'userId',
//                 'teamStreakId',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { currentStreak } = teamMemberStreak;
//         expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
//     });

//     test('returns no team streaks when timezone with no team streaks is used', async () => {
//         expect.assertions(1);
//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             timezone: 'Europe/Gambier Islands',
//         });
//         expect(teamStreaks.length).toEqual(0);
//     });

//     test(`archived team streaks can be retrieved`, async () => {
//         expect.assertions(17);

//         await streakoid.teamStreaks.update({
//             teamStreakId: teamStreakId,
//             updateData: { status: StreakStatus.archived },
//         });

//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             status: StreakStatus.archived,
//         });
//         const teamStreak = teamStreaks[0];
//         expect(teamStreak.streakName).toEqual(expect.any(String));
//         expect(teamStreak.status).toEqual(StreakStatus.archived);
//         expect(teamStreak.creatorId).toEqual(expect.any(String));
//         expect(teamStreak.timezone).toEqual(expect.any(String));
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'members',
//                 'status',
//                 'creatorId',
//                 'streakName',
//                 'timezone',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { members } = teamStreak;
//         expect(members.length).toEqual(1);

//         const member = members[0];
//         expect(member._id).toBeDefined();
//         expect(member.username).toEqual(username);
//         expect(member.profileImage).toEqual(originalImageUrl);
//         expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

//         const { teamMemberStreak } = member;
//         expect(Object.keys(teamMemberStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'currentStreak',
//                 'completedToday',
//                 'active',
//                 'pastStreaks',
//                 'userId',
//                 'teamStreakId',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { currentStreak } = teamMemberStreak;
//         expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
//     });

//     test(`deleted team streaks can be retrieved`, async () => {
//         expect.assertions(17);

//         await streakoid.teamStreaks.update({
//             teamStreakId,
//             updateData: { status: StreakStatus.deleted },
//         });

//         const teamStreaks = await streakoid.teamStreaks.getAll({
//             status: StreakStatus.deleted,
//         });
//         const teamStreak = teamStreaks[0];
//         expect(teamStreak.streakName).toEqual(expect.any(String));
//         expect(teamStreak.status).toEqual(StreakStatus.deleted);
//         expect(teamStreak.creatorId).toEqual(expect.any(String));
//         expect(teamStreak.timezone).toEqual(expect.any(String));
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'members',
//                 'status',
//                 'creatorId',
//                 'streakName',
//                 'timezone',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { members } = teamStreak;
//         expect(members.length).toEqual(1);

//         const member = members[0];
//         expect(member._id).toBeDefined();
//         expect(member.username).toEqual(username);
//         expect(member.profileImage).toEqual(originalImageUrl);
//         expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

//         const { teamMemberStreak } = member;
//         expect(Object.keys(teamMemberStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'currentStreak',
//                 'completedToday',
//                 'active',
//                 'pastStreaks',
//                 'userId',
//                 'teamStreakId',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//             ].sort(),
//         );

//         const { currentStreak } = teamMemberStreak;
//         expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
//     });
// });
