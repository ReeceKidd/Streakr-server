/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getSingleImageUploadMiddleware,
    imageTypeValidationMiddleware,
    getManipulateAvatarImageMiddleware,
    getS3UploadAvatarImageMiddleware,
    getS3UploadOriginalImageMiddleware,
    defineProfilePictureUrlsMiddleware,
    getSetUserProfilePicturesMiddlewares,
    sendProfilePicturesMiddleware,
    createProfilePictureMiddlewares,
    singleImageUploadMiddleware,
    manipulateAvatarImageMiddleware,
    setUserProfilePicturesMiddleware,
    s3UploadAvatarImageMiddleware,
    s3UploadOriginalImageMiddleware,
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

describe(`manipulateAvatarImageMiddleware`, () => {
    test('resizes image and sets response.locals.avatarImage', async () => {
        expect.assertions(5);
        const getBufferAsync = jest.fn().mockResolvedValue(true);
        const resize = jest.fn(() => ({ getBufferAsync }));
        const read = jest.fn().mockResolvedValue({ resize });
        const Jimp = {
            read,
        };
        const image = { buffer: 'string' };
        const request: any = {};
        const response: any = {
            locals: { image },
        };
        const next = jest.fn();

        const middleware = getManipulateAvatarImageMiddleware(Jimp as any);
        await middleware(request, response, next);

        expect(read).toBeCalledWith(image.buffer);
        expect(resize).toBeCalled();
        expect(getBufferAsync).toBeCalled();
        expect(response.locals.avatarImage).toBeDefined();
        expect(next).toBeCalled();
    });

    test('calls next with ManipulateProfilePictureMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        imageTypeValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.ManipulateProfilePictureMiddleware, expect.any(Error)));
    });
});

describe(`s3UploadAvatarImageMiddleware`, () => {
    test('uploads avatar image to s3 bucket named username-avatar', async () => {
        expect.assertions(3);
        const promise = jest.fn().mockResolvedValue(true);
        const putObject = jest.fn(() => ({ promise }));
        const s3Client = {
            putObject,
        };
        const avatarImage = true;
        const username = 'username';
        const user = {
            username,
        };
        const request: any = {};
        const response: any = {
            locals: { avatarImage, user },
        };
        const next = jest.fn();

        const middleware = getS3UploadAvatarImageMiddleware(s3Client as any);
        await middleware(request, response, next);

        expect(putObject).toBeCalledWith({
            Bucket: PROFILE_PICTURES_BUCKET,
            Body: avatarImage,
            Key: `${username}-avatar`,
        });
        expect(promise).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('calls next with S3UploadAvatarImage error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getS3UploadAvatarImageMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.S3UploadAvatarImage, expect.any(Error)));
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
        const image = { buffer: 'string' };
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
            Body: new Buffer(image.buffer),
            Key: `${username}-original`,
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

describe(`defineProfilePictureUrls`, () => {
    test('defines avatarImageUrl and originalImageUrl', async () => {
        expect.assertions(3);
        const username = 'username';
        const user = { username };
        const request: any = {};
        const response: any = {
            locals: { user },
        };
        const next = jest.fn();
        defineProfilePictureUrlsMiddleware(request, response, next);

        expect(response.locals.avatarImageUrl).toEqual(
            `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${user.username}-avatar`,
        );
        expect(response.locals.originalImageUrl).toEqual(
            `https://${PROFILE_PICTURES_BUCKET}.s3-eu-west-1.amazonaws.com/${user.username}-original`,
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
    test('updates the users profilePictures property to contain the avatarImageUrl and the originalImageUrl', async () => {
        expect.assertions(2);
        const updateOne = jest.fn().mockResolvedValue(true);
        const userModel = {
            updateOne,
        };
        const avatarImageUrl = 'avatarImageUrl';
        const originalImageUrl = 'originalImageUrl';
        const userId = 'userId';
        const user = {
            _id: userId,
        };

        const request: any = {};
        const response: any = {
            locals: { userModel, avatarImageUrl, originalImageUrl, user },
        };
        const next = jest.fn();

        const middleware = getSetUserProfilePicturesMiddlewares(userModel as any);
        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: user._id },
            { $set: { profilePictures: { avatarImageUrl, originalImageUrl } } },
        );
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
    test('responds with profile pictures', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const profilePictures = true;
        const response: any = { status, locals: { profilePictures } };
        const next = jest.fn();

        sendProfilePicturesMiddleware(request, response, next);

        expect(status).toBeCalledWith(201);
        expect(send).toBeCalledWith(profilePictures);
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
        expect.assertions(9);

        expect(createProfilePictureMiddlewares.length).toEqual(8);
        expect(createProfilePictureMiddlewares[0]).toEqual(singleImageUploadMiddleware);
        expect(createProfilePictureMiddlewares[1]).toEqual(imageTypeValidationMiddleware);
        expect(createProfilePictureMiddlewares[2]).toEqual(manipulateAvatarImageMiddleware);
        expect(createProfilePictureMiddlewares[3]).toEqual(s3UploadAvatarImageMiddleware);
        expect(createProfilePictureMiddlewares[4]).toEqual(s3UploadOriginalImageMiddleware);
        expect(createProfilePictureMiddlewares[5]).toEqual(defineProfilePictureUrlsMiddleware);
        expect(createProfilePictureMiddlewares[6]).toEqual(setUserProfilePicturesMiddleware);
        expect(createProfilePictureMiddlewares[7]).toEqual(sendProfilePicturesMiddleware);
    });
});
