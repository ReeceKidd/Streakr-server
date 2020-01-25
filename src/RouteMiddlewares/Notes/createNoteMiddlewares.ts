import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTypes, User, TeamStreak } from '@streakoid/streakoid-sdk/lib';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { UserModel } from '../../../src/Models/User';
import { TeamStreakModel } from '../../../src/Models/TeamStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { userModel } from '../../../src/Models/User';

const createNoteBodyValidationSchema = {
    userId: Joi.string().required(),
    streakId: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
    text: Joi.string().required(),
};

export const createNoteBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        createNoteBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateNoteFromRequestMiddleware = (noteModel: mongoose.Model<NoteModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, streakId, streakType, text } = request.body;
        console.log(request.body);
        const newNote = new noteModel({
            userId,
            streakId,
            streakType,
            text,
        });
        console.log(newNote);
        response.locals.savedNote = await newNote.save();
        next();
    } catch (err) {
        console.log('Entered error here');
        console.log(Object.keys(err));
        console.log(err.response);
        next(new CustomError(ErrorType.CreateNoteFromRequestMiddleware, err));
    }
};

export const createNoteFromRequestMiddleware = getCreateNoteFromRequestMiddleware(noteModel);

const expoClient = new Expo();

export const getNotifyTeamMembersThatUserHasAddedANoteMiddleware = (
    expo: typeof expoClient,
    teamStreakModel: mongoose.Model<TeamStreakModel>,
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakType, streakId, text } = request.body;
        if (streakType === StreakTypes.team) {
            const user: User = response.locals.user;
            const teamStreak: TeamStreak | null = await teamStreakModel.findById(streakId);
            if (!teamStreak) {
                throw new CustomError(ErrorType.CreateNoteTeamStreakDoesNotExist);
            }
            const messages: ExpoPushMessage[] = [];
            await Promise.all(
                teamStreak.members.map(async teamMember => {
                    const populatedMember: User | null = await userModel.findById(teamMember.memberId);
                    if (
                        populatedMember &&
                        populatedMember.pushNotificationToken &&
                        populatedMember.notifications.teamStreakUpdates.pushNotification &&
                        String(populatedMember._id) !== String(user._id)
                    ) {
                        messages.push({
                            to: populatedMember.pushNotificationToken,
                            sound: 'default',
                            title: `${populatedMember.username} added a note to ${teamStreak.streakName}`,
                            body: `${text}`,
                        });
                    }
                }),
            );
            if (messages.length > 0) {
                const chunks = await expo.chunkPushNotifications(messages);
                for (const chunk of chunks) {
                    await expo.sendPushNotificationsAsync(chunk);
                }
            }
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.NotifyTeamMembersThatUserHasAddedANoteMiddleware, err));
    }
};

export const notifiyTeamMembersThatUserHasAddedANoteMiddleware = getNotifyTeamMembersThatUserHasAddedANoteMiddleware(
    expoClient,
    teamStreakModel,
    userModel,
);

export const sendFormattedNoteMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedNote } = response.locals;
        response.status(ResponseCodes.created).send(savedNote);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedNoteMiddleware, err));
    }
};

export const createNoteMiddlewares = [
    createNoteBodyValidationMiddleware,
    createNoteFromRequestMiddleware,
    notifiyTeamMembersThatUserHasAddedANoteMiddleware,
    sendFormattedNoteMiddleware,
];
