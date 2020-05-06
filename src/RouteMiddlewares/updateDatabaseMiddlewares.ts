import { Request, Response, NextFunction } from 'express';

import { CustomError, ErrorType } from '../customError';
import { userModel } from '../../src/Models/User';
import { challengeStreakModel } from '../../src/Models/ChallengeStreak';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { challengeModel } from '../../src/Models/Challenge';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

export const updateDatabaseMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreaks: ChallengeStreak[] = await challengeStreakModel.find({});
        await Promise.all(
            challengeStreaks.map(async challengeStreak => {
                const challenge: Challenge | null = await challengeModel.findById(challengeStreak._id);
                const user: User | null = await userModel.findById(challengeStreak.userId);
                await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, {
                    $set: {
                        username: user && user.username,
                        userProfileImage: user && user.profileImages.originalImageUrl,
                        challengeName: challenge && challenge.name,
                    },
                });
            }),
        );
        response.send('success');
    } catch (err) {
        console.log(err);
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
    }
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
