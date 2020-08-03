// import { Request, Response } from 'express';
// import { soloStreakModel } from '../Models/SoloStreak';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const soloStreaks = await soloStreakModel.find({});
//     await Promise.all(
//         soloStreaks.map(async soloStreak => {
//             if (!soloStreak.pastStreaks) {
//                 console.log('Entered');
//                 // await soloStreakModel.findByIdAndUpdate(soloStreak._id, { $set: { pastStreaks: [] } });
//             }
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
