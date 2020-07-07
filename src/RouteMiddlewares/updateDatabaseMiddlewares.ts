// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../Models/User';
// import { soloStreakModel } from '../Models/SoloStreak';
// import { challengeStreakModel } from '../Models/ChallengeStreak';
// import { oidXpValues } from '../helpers/oidXpValues';
// import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
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
//                 const soloStreaks = await soloStreakModel.find({ userId: user._id });

//                 let soloStreakOidXp = 0;
//                 const soloStreakOidXpValue = oidXpValues[OidXpSourcesTypes.soloStreakComplete];
//                 soloStreaks.map(soloStreak => {
//                     soloStreakOidXp += soloStreak.totalTimesTracked * soloStreakOidXpValue;
//                 });

//                 const challengeStreaks = await challengeStreakModel.find({ userId: user._id });
//                 let challengeStreakOidXp = 0;
//                 const challengeStreakOidXpValue = oidXpValues[OidXpSourcesTypes.challengeStreakComplete];
//                 challengeStreaks.map(challengeStreak => {
//                     challengeStreakOidXp += challengeStreak.totalTimesTracked * challengeStreakOidXpValue;
//                 });

//                 const teamMemberStreaks = await teamMemberStreakModel.find({ userId: user._id });
//                 let teamMemberStreakOidXp = 0;
//                 const teamMemberStreakOidXpValue = oidXpValues[OidXpSourcesTypes.teamMemberStreakComplete];
//                 teamMemberStreaks.map(teamMemberStreak => {
//                     teamMemberStreakOidXp += teamMemberStreak.totalTimesTracked * teamMemberStreakOidXpValue;
//                 });

//                 const totalOidXp = soloStreakOidXp + challengeStreakOidXp + teamMemberStreakOidXp;

//                 await userModel.findByIdAndUpdate(user._id, { $set: { oidXp: totalOidXp } });
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
