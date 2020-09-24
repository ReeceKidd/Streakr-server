import { Request, Response } from 'express';

import { userModel } from '../Models/User';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const users = await userModel.find({ username: 'reece' });
    await Promise.all(
        users.map(async user => {
            return userModel.findByIdAndUpdate(user._id, {
                $set: { achievements: user.achievements.filter(achievement => achievement !== null) },
            });
        }),
    );

    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
