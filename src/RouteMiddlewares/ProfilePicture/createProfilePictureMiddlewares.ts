import aws from 'aws-sdk';
import { Request, Response } from 'express';
import Jimp from 'jimp';
import multer from 'multer';
import util from 'util';

import { getServiceConfig } from '../../getServiceConfig';
import { NextFunction } from 'connect';
import { CustomError } from '../../customError';
import { ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';
import { Model } from 'mongoose';
import { UserModel, userModel } from '../../Models/User';

const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, PROFILE_PICTURES_BUCKET } = getServiceConfig();
aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: AWS_REGION,
});

const s3 = new aws.S3();

const upload = multer();

const singleImageUpload = upload.single('image');
const promiseSingleImageUpload = util.promisify(singleImageUpload);

const avatar = 'avatar';
const original = 'original';

export const getSingleImageUploadMiddleware = (singleImageUpload: Function) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        console.log('Entered');
        await singleImageUpload(request, response);
        const image = request.file;
        console.log(request);
        console.log(image);
        if (!image) {
            throw new CustomError(ErrorType.NoImageInRequest);
        }
        response.locals.image = image;
        console.log(1);
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetSingleImageUploadMiddleware, err));
    }
};

export const singleImageUploadMiddleware = getSingleImageUploadMiddleware(promiseSingleImageUpload);

export const imageTypeValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        console.log(2);
        const { image } = response.locals;
        const { mimetype } = image;
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg') {
            throw new CustomError(ErrorType.InvalidImageFormat);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ImageTypeValidationMiddleware, err));
    }
};

export const getManipulateAvatarImageMiddleware = (jimp: typeof Jimp) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        console.log(3);
        const { image } = response.locals;
        const jimpImage = await jimp.read(image.buffer);
        const avatarImage = jimpImage.resize(300, 300);
        response.locals.avatarImage = avatarImage;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ManipulateProfilePictureMiddleware, err));
    }
};

export const manipulateAvatarImageMiddleware = getManipulateAvatarImageMiddleware(Jimp);

export const getS3UploadAvatarImageMiddleware = (s3Client: typeof s3) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { avatarImage, user } = response.locals;
        await s3Client
            .putObject({
                Bucket: PROFILE_PICTURES_BUCKET,
                Body: new Buffer(avatarImage.buffer),
                Key: `${user.username}-${avatar}`,
            })
            .promise();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.S3UploadAvatarImage, err));
    }
};

export const s3UploadAvatarImageMiddleware = getS3UploadAvatarImageMiddleware(s3);

export const getS3UploadOriginalImageMiddleware = (s3Client: typeof s3) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { image, user } = response.locals;
        await s3Client
            .putObject({
                Bucket: PROFILE_PICTURES_BUCKET,
                Body: new Buffer(image.buffer),
                Key: `${user.username}-${original}`,
            })
            .promise();
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.S3UploadOriginalImage, err));
    }
};

export const s3UploadOriginalImageMiddleware = getS3UploadOriginalImageMiddleware(s3);

export const defineProfilePictureUrlsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { user } = response.locals;
        const avatarImageUrl = `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${user.username}-${avatar}`;
        const originalImageUrl = `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${user.username}-${original}`;
        response.locals = {
            ...response.locals,
            avatarImageUrl,
            originalImageUrl,
        };
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DefineProfilePictures, err));
    }
};

export const getSetUserProfilePicturesMiddlewares = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user, avatarImageUrl, originalImageUrl } = response.locals;
        const profilePictures = {
            avatarImageUrl,
            originalImageUrl,
        };
        await userModel.updateOne({ _id: user._id }, { $set: { profilePictures } });
        response.locals.profilePictures = profilePictures;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.SetUserProfilePictures, err));
    }
};

export const setUserProfilePicturesMiddleware = getSetUserProfilePicturesMiddlewares(userModel);

export const sendProfilePicturesMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { profilePictures } = response.locals;
        response.status(ResponseCodes.created).send(profilePictures);
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.SendProfilePictures, err));
    }
};

const createProfilePictureMiddlewares = [
    singleImageUploadMiddleware,
    imageTypeValidationMiddleware,
    manipulateAvatarImageMiddleware,
    s3UploadAvatarImageMiddleware,
    s3UploadOriginalImageMiddleware,
    defineProfilePictureUrlsMiddleware,
    setUserProfilePicturesMiddleware,
    sendProfilePicturesMiddleware,
];

export { createProfilePictureMiddlewares };
