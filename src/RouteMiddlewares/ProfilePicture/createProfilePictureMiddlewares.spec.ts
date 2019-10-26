/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getSingleImageUploadMiddleware,
    imageTypeValidationMiddleware,
    getS3UploadOriginalImageMiddleware,
    defineProfilePictureUrlsMiddleware,
    getSetUserProfilePicturesMiddlewares,
    sendProfilePicturesMiddleware,
    createProfilePictureMiddlewares,
    singleImageUploadMiddleware,
    setUserProfilePicturesMiddleware,
    s3UploadOriginalImageMiddleware,
    retreiveVersionedObjectMiddleware,
    getRetreiveVersionedObjectMiddleware,
} from './createProfilePictureMiddlewares';
import { CustomError } from '../../../src/customError';
import { ErrorType } from '../../../src/customError';
import { getServiceConfig } from '../../../src/getServiceConfig';

const { PROFILE_PICTURES_BUCKET } = getServiceConfig();

describe(`singleImageUploadMiddleware`, () => {
    test('populates request.file, sets response.locals.image and calls next', async () => {
        expect.assertions(2);
        const file = 'file';
        const request: any = {
            file,
        };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        const singleImageUpload = jest.fn().mockResolvedValue(true);

        const middleware = getSingleImageUploadMiddleware(singleImageUpload);
        await middleware(request, response, next);

        expect(response.locals.image).toBeDefined();
        expect(next).toBeCalled();
    });

    test(`throws no image in request error if mulcher does not populate request.file`, async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        const singleImageUpload = jest.fn().mockResolvedValue(true);

        const middleware = getSingleImageUploadMiddleware(singleImageUpload);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoImageInRequest));
    });

    test('calls next with GetSingleImageUploadMiddleware  error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getSingleImageUploadMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetSingleImageUploadMiddleware, expect.any(Error)));
    });
});

describe(`imageTypeValidationMiddleware`, () => {
    test('next is called if mime type equals image/jpeg', async () => {
        expect.assertions(2);
        const image = { mimetype: 'image/jpeg' };
        const request: any = {};
        const response: any = {
            locals: { image },
        };
        const next = jest.fn();
        imageTypeValidationMiddleware(request, response, next);

        expect(response.locals.image).toBeDefined();
        expect(next).toBeCalled();
    });

    test('next is called if mime type equals image/png', async () => {
        expect.assertions(2);
        const image = { mimetype: 'image/png' };
        const request: any = {};
        const response: any = {
            locals: { image },
        };
        const next = jest.fn();
        imageTypeValidationMiddleware(request, response, next);

        expect(response.locals.image).toBeDefined();
        expect(next).toBeCalled();
    });

    test('next is called if mime type equals image/jpg', async () => {
        expect.assertions(2);
        const image = { mimetype: 'image/png' };
        const request: any = {};
        const response: any = {
            locals: { image },
        };
        const next = jest.fn();
        imageTypeValidationMiddleware(request, response, next);

        expect(response.locals.image).toBeDefined();
        expect(next).toBeCalled();
    });

    test(`throws invalid image mime type`, async () => {
        expect.assertions(1);
        const image = { mimetype: 'image/invalid' };
        const request: any = {};
        const response: any = {
            locals: { image },
        };
        const next = jest.fn();

        await imageTypeValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.InvalidImageFormat));
    });

    test('calls next with ImageTypeValidationMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        imageTypeValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.ImageTypeValidationMiddleware, expect.any(Error)));
    });
});

describe(`s3UploadOriginalImageMiddleware`, () => {
    test('uploads original image to s3 bucket named username-original', async () => {
        expect.assertions(3);
        const promise = jest.fn().mockResolvedValue(true);
        const putObject = jest.fn(() => ({ promise }));
        const s3Client = {
            putObject,
        };
        const image = { buffer: 'string', mimetype: 'image/jpg' };
        const username = 'username';
        const user = {
            username,
        };
        const request: any = {};
        const response: any = {
            locals: { image, user },
        };
        const next = jest.fn();

        const middleware = getS3UploadOriginalImageMiddleware(s3Client as any);
        await middleware(request, response, next);

        expect(putObject).toBeCalledWith({
            Bucket: PROFILE_PICTURES_BUCKET,
            Body: image.buffer,
            ContentType: image.mimetype,
            Key: `${username}-original.jpg`,
        });
        expect(promise).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('calls next with S3UploadOriginalImage error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getS3UploadOriginalImageMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.S3UploadOriginalImage, expect.any(Error)));
    });
});

describe(`retreiveVersionedObjectMiddleware`, () => {
    test('retreives versions of objects and sets mostRecentImageVersionId', async () => {
        expect.assertions(4);
        const VersionId = 'v1';
        const Version = {
            VersionId,
            IsLatest: true,
        };
        const Versions = [Version];
        const promise = jest.fn().mockResolvedValue({ Versions });
        const listObjectVersions = jest.fn(() => ({ promise }));
        const s3Client = {
            listObjectVersions,
        };
        const username = 'username';
        const user = {
            username,
        };
        const request: any = {};
        const response: any = {
            locals: { user },
        };
        const next = jest.fn();

        const middleware = getRetreiveVersionedObjectMiddleware(s3Client as any);
        await middleware(request, response, next);

        expect(listObjectVersions).toBeCalledWith({
            Bucket: PROFILE_PICTURES_BUCKET,
            Prefix: `${username}-original`,
        });
        expect(response.locals.latestImageVersionId).toBeDefined();
        expect(promise).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('calls next with S3UploadOriginalImage error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getS3UploadOriginalImageMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.S3UploadOriginalImage, expect.any(Error)));
    });
});

describe(`defineProfilePictureUrls`, () => {
    test('defines originalImageUrl', async () => {
        expect.assertions(2);
        const imageKey = 'image-orginal.jpg';
        const latestImageVersionId = 'v1';
        const request: any = {};
        const response: any = {
            locals: { imageKey, latestImageVersionId },
        };
        const next = jest.fn();
        defineProfilePictureUrlsMiddleware(request, response, next);

        expect(response.locals.originalImageUrl).toEqual(
            `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${imageKey}?versionId=${latestImageVersionId}`,
        );
        expect(next).toBeCalled();
    });

    test('calls next with DefineProfilePictures error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        defineProfilePictureUrlsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DefineProfilePictures, expect.any(Error)));
    });
});

describe(`setUserProfilePicturesMiddlewares`, () => {
    test('updates the users profileImages property to contain the originalImageUrl', async () => {
        expect.assertions(2);
        const updateOne = jest.fn().mockResolvedValue(true);
        const userModel = {
            updateOne,
        };
        const originalImageUrl = 'originalImageUrl';
        const userId = 'userId';
        const user = {
            _id: userId,
        };

        const request: any = {};
        const response: any = {
            locals: { userModel, originalImageUrl, user },
        };
        const next = jest.fn();

        const middleware = getSetUserProfilePicturesMiddlewares(userModel as any);
        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith({ _id: user._id }, { $set: { profileImages: { originalImageUrl } } });
        expect(next).toBeCalledWith();
    });

    test('calls next with SetUserProfilePictures error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getS3UploadOriginalImageMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SetUserProfilePictures, expect.any(Error)));
    });
});

describe('sendProfilePicturesMiddlewares', () => {
    test('responds resource created status code and sends profile images', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const profileImages = true;
        const response: any = { status, locals: { profileImages } };
        const next = jest.fn();

        sendProfilePicturesMiddleware(request, response, next);

        expect(status).toBeCalledWith(201);
        expect(send).toBeCalledWith(profileImages);
        expect(next).not.toBeCalled();
    });

    test('that on middleware failure next is called with SendProfilePictures', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendProfilePicturesMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendProfilePictures, expect.any(Error)));
    });
});

describe('createProfilePictureMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(8);

        expect(createProfilePictureMiddlewares.length).toEqual(7);
        expect(createProfilePictureMiddlewares[0]).toEqual(singleImageUploadMiddleware);
        expect(createProfilePictureMiddlewares[1]).toEqual(imageTypeValidationMiddleware);
        expect(createProfilePictureMiddlewares[2]).toEqual(s3UploadOriginalImageMiddleware);
        expect(createProfilePictureMiddlewares[3]).toEqual(retreiveVersionedObjectMiddleware);
        expect(createProfilePictureMiddlewares[4]).toEqual(defineProfilePictureUrlsMiddleware);
        expect(createProfilePictureMiddlewares[5]).toEqual(setUserProfilePicturesMiddleware);
        expect(createProfilePictureMiddlewares[6]).toEqual(sendProfilePicturesMiddleware);
    });
});
