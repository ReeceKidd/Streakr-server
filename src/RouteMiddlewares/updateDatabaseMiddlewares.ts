// // This is just used to update the datbase while I figure out how to connect robo3t again.

// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';
// import { completeSoloStreakTaskModel } from '../../src/Models/CompleteSoloStreakTask';
// import { completeChallengeStreakTaskModel } from '../../src/Models/CompleteChallengeStreakTask';
// import { completeTeamMemberStreakTaskModel } from '../../src/Models/CompleteTeamMemberStreakTask';
// import { incompleteSoloStreakTaskModel } from '../../src/Models/IncompleteSoloStreakTask';
// import { incompleteChallengeStreakTaskModel } from '../../src/Models/IncompleteChallengeStreakTask';
// import { incompleteTeamMemberStreakTaskModel } from '../../src/Models/IncompleteTeamMemberStreakTask';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find({});
//         await Promise.all(
//             users.map(async user => {
//                 const completeSoloStreaks = await completeSoloStreakTaskModel.count({ userId: user._id });
//                 const incompleteSoloStreaks = await incompleteSoloStreakTaskModel.count({ userId: user._id });
//                 const soloStreaks = completeSoloStreaks - incompleteSoloStreaks;
//                 const completeChallengeStreaks = await completeChallengeStreakTaskModel.count({
//                     userId: user._id,
//                 });
//                 const incompleteChallengeStreaks = await incompleteChallengeStreakTaskModel.count({ userId: user._id });
//                 const challengeStreaks = completeChallengeStreaks - incompleteChallengeStreaks;
//                 const completeTeamMemberStreaks = await completeTeamMemberStreakTaskModel.count({
//                     userId: user._id,
//                 });
//                 const incompleteTeamMemberStreaks = await incompleteTeamMemberStreakTaskModel.count({
//                     userId: user._id,
//                 });
//                 const teamMemberStreakTasks = completeTeamMemberStreaks - incompleteTeamMemberStreaks;
//                 const total = soloStreaks + challengeStreaks + teamMemberStreakTasks;
//                 await userModel.findByIdAndUpdate(user._id, { $set: { totalStreakCompletes: total } });
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
