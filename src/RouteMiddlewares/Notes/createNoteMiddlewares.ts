import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { UserModel } from '../../../src/Models/User';
import { TeamStreakModel } from '../../../src/Models/TeamStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { userModel } from '../../../src/Models/User';
import { AddedNoteToTeamStreakPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import { sendPushNotification } from '../../../src/helpers/sendPushNotification';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const createNoteBodyValidationSchema = {
    userId: Joi.string().required(),
    subjectId: Joi.string().required(),
    text: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
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

export const getNotifyTeamMembersThatUserHasAddedANoteMiddleware = (
    sendPush: typeof sendPushNotification,
    teamStreakModel: mongoose.Model<TeamStreakModel>,
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { subjectId, userId, text, streakType } = request.body;
        if (streakType === StreakTypes.team) {
            const teamStreak = await teamStreakModel.findById(subjectId);
            if (!teamStreak) {
                throw new CustomError(ErrorType.NotifyTeamMembersThatUserHasAddedANoteTeamStreakDoesNotExist);
            }
            const userWhoCreatedNote = await userModel.findOne({ _id: userId }).lean();
            if (!userWhoCreatedNote) {
                throw new CustomError(ErrorType.CreateNoteUserDoesNotExist);
            }
            const title = `${userWhoCreatedNote.username} added a note to ${teamStreak.streakName}`;
            const body = `${text}`;
            const data: AddedNoteToTeamStreakPushNotification = {
                pushNotificationType: PushNotificationTypes.addedNoteToTeamStreak,
                note: text,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                userId: userWhoCreatedNote.userId,
                username: userWhoCreatedNote.username,
                title,
                body,
            };
            await Promise.all(
                teamStreak.members.map(async teamMember => {
                    const populatedMember: User | null = await userModel.findById(teamMember.memberId);
                    if (!populatedMember) {
                        return;
                    }
                    const { pushNotification, pushNotifications } = populatedMember;
                    const deviceType = pushNotification && pushNotification.deviceType;
                    const endpointArn = pushNotification && pushNotification.endpointArn;
                    const teamStreakUpdatesEnabled =
                        pushNotifications &&
                        pushNotifications.teamStreakUpdates &&
                        pushNotifications.teamStreakUpdates.enabled;
                    if (
                        deviceType &&
                        endpointArn &&
                        teamStreakUpdatesEnabled &&
                        String(populatedMember._id) !== String(userWhoCreatedNote._id)
                    ) {
                        return sendPush({ title, body, data, endpointArn, deviceType });
                    }
                }),
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.NotifyTeamMembersThatUserHasAddedANoteMiddleware, err));
    }
};

export const notifiyTeamMembersThatUserHasAddedANoteMiddleware = getNotifyTeamMembersThatUserHasAddedANoteMiddleware(
    sendPushNotification,
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
