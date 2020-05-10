// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';
// // import { soloStreakModel } from '../../src/Models/SoloStreak';
// // import { challengeStreakModel } from '../../src/Models/ChallengeStreak';
// // import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
// // import { teamMemberStreakModel } from '../../src/Models/TeamMemberStreak';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find();
//         await Promise.all(
//             users.map(async user => {
//                 // const soloStreaks = await soloStreakModel.countDocuments({
//                 //     userId: user._id,
//                 //     status: StreakStatus.live,
//                 // });
//                 // const challengeStreaks = await challengeStreakModel.countDocuments({
//                 //     userId: user._id,
//                 //     status: StreakStatus.live,
//                 // });
//                 // const teamMemberStreaks = await teamMemberStreakModel.countDocuments({
//                 //     userId: user._id,
//                 //     active: true,
//                 // });
//                 // const total = soloStreaks + challengeStreaks + teamMemberStreaks;
//                 // await userModel.findByIdAndUpdate(user._id, { $set: { totalLiveStreaks: Number(total) } });
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: {
//                         totalStreakCompletes: Number(user.totalStreakCompletes),
//                         totalLiveStreaks: Number(user.totalLiveStreaks),
//                     },
//                 });
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         console.log(err);
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
