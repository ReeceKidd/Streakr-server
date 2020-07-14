// import { Request, Response } from 'express';

// import { challengeStreakModel } from '../Models/ChallengeStreak';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const challengeStreak = await challengeStreakModel.findById('5f0d941beb2b272daafcf511');
//     const numberOfDaysInARow = 11;
//     const lostStreak = {
//         endDate: new Date().toString(),
//         startDate: new Date().toString(),
//         numberOfDaysInARow,
//     };
//     if (challengeStreak) {
//         await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, {
//             $set: {
//                 currentStreak: {
//                     startDate: new Date().toISOString(),
//                     numberOfDaysInARow: 0,
//                 },
//                 completedToday: false,
//                 active: false,
//                 pastStreaks: [
//                     { startDate: new Date().toString(), endDate: new Date().toString(), numberOfDaysInARow: 0 },
//                     lostStreak,
//                 ],
//             },
//         });
//     }

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
