import { Request, Response } from 'express';
import { userModel } from '../Models/User';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const users = await userModel.find({});

    await Promise.all(
        users.map(user => {
            return userModel.findByIdAndUpdate(user.id, {
                $set: {
                    pushNotification: {
                        androidToken: null,
                        iosToken: null,
                        androidEndpointArn: null,
                        iosEndpointArn: null,
                    },
                },
            });
        }),
    );

    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
