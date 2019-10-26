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
        const imageKey = `${user.username}-${original}`;
        await s3Client
            .putObject({
                Bucket: PROFILE_PICTURES_BUCKET,
                Body: image.buffer,
                ContentType: image.mimetype,
                Key: imageKey,
            })
            .promise();
        response.locals.imageKey = imageKey;
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
        const { imageKey } = response.locals;
        const imageVersions = await s3Client
            .listObjectVersions({ Bucket: PROFILE_PICTURES_BUCKET, Prefix: imageKey })
            .promise();
        const latestImageVersion =
            imageVersions && imageVersions.Versions && imageVersions.Versions.filter(version => version.IsLatest)[0];
        const latestImageVersionId = latestImageVersion && latestImageVersion.VersionId;
        response.locals.latestImageVersionId = latestImageVersionId;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.S3UploadOriginalImage, err));
    }
};

export const retreiveVersionedObjectMiddleware = getRetreiveVersionedObjectMiddleware(s3);

export const defineProfilePictureUrlsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { imageKey, latestImageVersionId } = response.locals;
        const originalImageUrl = `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${imageKey}?versionId=${latestImageVersionId}`;
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
        const profileImages = {
            originalImageUrl,
        };
        await userModel.updateOne({ _id: user._id }, { $set: { profileImages } });
        response.locals.profileImages = profileImages;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.SetUserProfilePictures, err));
    }
};

export const setUserProfilePicturesMiddleware = getSetUserProfilePicturesMiddlewares(userModel);

export const sendProfilePicturesMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { profileImages } = response.locals;
        response.status(ResponseCodes.created).send(profileImages);
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
