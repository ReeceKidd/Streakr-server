import aws from 'aws-sdk';
import { Request, Response } from 'express';
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

const original = 'original';

export const getSingleImageUploadMiddleware = (singleImageUpload: Function) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await singleImageUpload(request, response);
        const image = request.file;
        if (!image) {
            throw new CustomError(ErrorType.NoImageInRequest);
        }
        response.locals.image = image;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetSingleImageUploadMiddleware, err));
    }
};

export const singleImageUploadMiddleware = getSingleImageUploadMiddleware(promiseSingleImageUpload);

export const imageTypeValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
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

export const getRetreiveVersionedObjectMiddleware = (s3Client: typeof s3) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const imageVersions = await s3Client
            .listObjectVersions({ Bucket: PROFILE_PICTURES_BUCKET, Prefix: `${user.username}` })
            .promise();
        const mostRecentImageVersionId =
            imageVersions && imageVersions.Versions && imageVersions.Versions[0] && imageVersions.Versions[0].VersionId;
        response.locals.mostRecentImageVersionId = mostRecentImageVersionId;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.S3UploadOriginalImage, err));
    }
};

export const retreiveVersionedObjectMiddleware = getRetreiveVersionedObjectMiddleware(s3);

export const defineProfilePictureUrlsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { user, mostRecentImageVersionId } = response.locals;
        const originalImageUrl = `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${user.username}-${original}?versionId=${mostRecentImageVersionId}`;
        response.locals.originalImageUrl = originalImageUrl;
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
        const { originalImageUrl, user } = response.locals;
        const profilePictures = {
            originalImageUrl,
            updatedAt: new Date().toString(),
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
    s3UploadOriginalImageMiddleware,
    retreiveVersionedObjectMiddleware,
    defineProfilePictureUrlsMiddleware,
    setUserProfilePicturesMiddleware,
    sendProfilePicturesMiddleware,
];

export { createProfilePictureMiddlewares };
