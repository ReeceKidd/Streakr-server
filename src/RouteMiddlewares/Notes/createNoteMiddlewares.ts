import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { UserModel } from '../../../src/Models/User';
import { TeamStreakModel } from '../../../src/Models/TeamStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { userModel } from '../../../src/Models/User';

const createNoteBodyValidationSchema = {
    userId: Joi.string().required(),
    subjectId: Joi.string().required(),
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
        const { userId, subjectId, text } = request.body;
        const newNote = new noteModel({
            userId,
            subjectId,
            text,
        });
        response.locals.savedNote = await newNote.save();
        next();
    } catch (err) {
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
        const { subjectId, userId, text } = request.body;
        const teamStreak = await teamStreakModel.findById(subjectId);
        if (teamStreak) {
            const userWhoCreatedNote = await userModel.findOne({ _id: userId }).lean();
            if (!userWhoCreatedNote) {
                throw new CustomError(ErrorType.CreateNoteUserDoesNotExist);
            }
            const messages: ExpoPushMessage[] = [];
            await Promise.all(
                teamStreak.members.map(async teamMember => {
                    const populatedMember: UserModel | null = await userModel.findById(teamMember.memberId);
                    if (
                        populatedMember &&
                        populatedMember.pushNotificationToken &&
                        populatedMember.notifications.teamStreakUpdates.pushNotification &&
                        String(populatedMember._id) !== String(userWhoCreatedNote._id)
                    ) {
                        messages.push({
                            to: populatedMember.pushNotificationToken,
                            sound: 'default',
                            title: `${userWhoCreatedNote.username} added a note to ${teamStreak.streakName}`,
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
