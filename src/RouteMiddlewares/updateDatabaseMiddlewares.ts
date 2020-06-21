// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';
// import { soloStreakModel } from '../Models/SoloStreak';
// import { challengeStreakModel } from '../Models/ChallengeStreak';
// import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
// import { teamMemberStreakModel } from '../Models/TeamMemberStreak';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find({});
//         await Promise.all(
//             users.map(async user => {
//                 const soloStreaks = await soloStreakModel.find({ userId: user._id, status: StreakStatus.live });
//                 const soloStreaksOrder = soloStreaks.map(soloStreak => String(soloStreak._id));
//                 console.log('soloStreaks', soloStreaksOrder.length);
//                 const challengeStreaks = await challengeStreakModel.find({
//                     userId: user._id,
//                     status: StreakStatus.live,
//                 });
//                 const challengeStreaksOrder = challengeStreaks.map(challengeStreak => String(challengeStreak._id));
//                 console.log('challengeStreaks', challengeStreaksOrder.length);
//                 const teamMemberStreaks = await teamMemberStreakModel.find({
//                     userId: user._id,
//                     active: true,
//                 });
//                 const teamStreaksOrder = teamMemberStreaks.map(teamMemberStreak => teamMemberStreak.teamStreakId);
//                 console.log('teamStreaksOrder', teamStreaksOrder.length);
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: {
//                         soloStreaksOrder,
//                         challengeStreaksOrder,
//                         teamStreaksOrder,
//                     },
//                 });
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
