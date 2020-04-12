// // This is just used to update the datbase while I figure out how to connect robo3t again.

// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { agendaJobModel } from '../Models/AgendaJob';
// import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const agendaJobs = await agendaJobModel.deleteMany({ name: AgendaJobNames.completeStreaksReminder });
//         response.send(agendaJobs);
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetreiveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
