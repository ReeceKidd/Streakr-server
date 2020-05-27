// import { StreakoidFactory, londonTimezone } from '../src/streakoid';
// import { streakoidTest } from './setup/streakoidTest';
// import { getPayingUser } from './setup/getPayingUser';
// import { isTestEnvironment } from './setup/isTestEnvironment';
// import { setUpDatabase } from './setup/setupDatabase';
// import { tearDownDatabase } from './setup/tearDownDatabase';
// import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
// import { getServiceConfig } from '../getServiceConfig';

// const username = getServiceConfig().USER;
// const originalImageUrl = getServiceConfig().ORIGINAL_IMAGE_URL;

// jest.setTimeout(120000);

// describe('GET /complete-solo-streak-tasks', () => {
//     let streakoid: StreakoidFactory;
//     let userId: string;
//     let teamStreakId: string;
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
//         }
//     });

//     afterAll(async () => {
//         if (isTestEnvironment()) {
//             await tearDownDatabase();
//         }
//     });

//     test(`team streak can be retrieved with populated member information`, async () => {
//         expect.assertions(19);

//         const teamStreak = await streakoid.teamStreaks.getOne(teamStreakId);

//         expect(teamStreak.members.length).toEqual(1);
//         const member = teamStreak.members[0];
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

//         expect(teamStreak.streakName).toEqual(streakName);
//         expect(teamStreak.status).toEqual(StreakStatus.live);
//         expect(teamStreak.creatorId).toBeDefined();
//         expect(teamStreak.timezone).toEqual(londonTimezone);
//         expect(teamStreak.active).toEqual(false);
//         expect(teamStreak.completedToday).toEqual(false);
//         expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
//         expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
//         expect(teamStreak.pastStreaks.length).toEqual(0);
//         expect(Object.keys(teamStreak).sort()).toEqual(
//             [
//                 '_id',
//                 'status',
//                 'members',
//                 'creatorId',
//                 'streakName',
//                 'active',
//                 'completedToday',
//                 'currentStreak',
//                 'pastStreaks',
//                 'timezone',
//                 'createdAt',
//                 'updatedAt',
//                 '__v',
//                 'creator',
//             ].sort(),
//         );

//         const { creator } = teamStreak;
//         expect(creator._id).toBeDefined();
//         expect(creator.username).toEqual(username);
//         expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
//     });

//     test(`sends team streak does not exist error when solo streak doesn't exist`, async () => {
//         expect.assertions(5);

//         try {
//             await streakoid.teamStreaks.getOne('5d54487483233622e43270f9');
//         } catch (err) {
//             const { data } = err.response;
//             const { code, message, httpStatusCode } = data;
//             expect(err.response.status).toEqual(400);
//             expect(code).toEqual('400-25');
//             expect(message).toEqual('Team streak does not exist.');
//             expect(httpStatusCode).toEqual(400);
//             expect(Object.keys(data).sort()).toEqual(['code', 'message', 'httpStatusCode'].sort());
//         }
//     });
// });
