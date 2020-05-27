// import { StreakoidFactory, londonTimezone } from '../src/streakoid';
// import { streakoidTest } from './setup/streakoidTest';
// import { getPayingUser } from './setup/getPayingUser';
// import { isTestEnvironment } from './setup/isTestEnvironment';
// import { setUpDatabase } from './setup/setupDatabase';
// import { tearDownDatabase } from './setup/tearDownDatabase';

// jest.setTimeout(120000);

// describe('GET /complete-solo-streak-tasks', () => {
//     let streakoid: StreakoidFactory;
//     let userId: string;
//     let teamStreakId: string;
//     let teamMemberStreakId: string;
//     const streakName = 'Daily Spanish';

//     beforeAll(async () => {
//         if (isTestEnvironment()) {
//             await setUpDatabase();
//             const user = await getPayingUser();
//             userId = user._id;
//             streakoid = await streakoidTest();
//             const members = [{ memberId: userId }];

//             const teamStreak = await streakoid.teamStreaks.create({
//                 creatorId: userId,
//                 streakName,
//                 members,
//             });
//             teamStreakId = teamStreak._id;

//             const teamMemberStreak = await streakoid.teamMemberStreaks.create({
//                 userId,
//                 teamStreakId,
//             });
//             teamMemberStreakId = teamMemberStreak._id;
//         }
//     });

//     afterAll(async () => {
//         if (isTestEnvironment()) {
//             await tearDownDatabase();
//         }
//     });

//     test(`team member streak can be retrieved`, async () => {
//         expect.assertions(12);

//         const teamMemberStreak = await streakoid.teamMemberStreaks.getOne(teamMemberStreakId);

//         expect(teamMemberStreak._id).toEqual(expect.any(String));
//         expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamMemberStreak.completedToday).toEqual(false);
//         expect(teamMemberStreak.active).toEqual(false);
//         expect(teamMemberStreak.pastStreaks).toEqual([]);
//         expect(teamMemberStreak.userId).toEqual(expect.any(String));
//         expect(teamMemberStreak.teamStreakId).toEqual(teamStreakId);
//         expect(teamMemberStreak.timezone).toEqual(londonTimezone);
//         expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
//         expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
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
//     });

//     test(`sends team member streak does not exist error when team member streak doesn't exist`, async () => {
//         expect.assertions(5);

//         try {
//             await streakoid.teamMemberStreaks.getOne('5d54487483233622e43270f9');
//         } catch (err) {
//             const { data } = err.response;
//             const { code, message, httpStatusCode } = data;
//             expect(err.response.status).toEqual(400);
//             expect(code).toEqual('400-34');
//             expect(message).toEqual('Team member streak does not exist.');
//             expect(httpStatusCode).toEqual(400);
//             expect(Object.keys(data).sort()).toEqual(['code', 'message', 'httpStatusCode'].sort());
//         }
//     });
// });
