import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { setupDatabase } from './setup/setupDatabase';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

const username = 'username';

jest.setTimeout(120000);

const testName = 'POST-emails';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDKFactory({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });

    test(`creates email with minimum parameters`, async () => {
        expect.assertions(8);

        const name = 'Jane';
        const email = 'jane@gmail.com';
        const subject = 'Cancel memership';
        const message = 'I need help';

        const emailDocument = await SDK.emails.create({
            name,
            email,
            subject,
            message,
        });

        expect(emailDocument._id).toEqual(expect.any(String));
        expect(emailDocument.name).toEqual(name);
        expect(emailDocument.email).toEqual(email);
        expect(emailDocument.subject).toEqual(subject);
        expect(emailDocument.message).toEqual(message);
        expect(emailDocument.createdAt).toEqual(expect.any(String));
        expect(emailDocument.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(emailDocument).sort()).toEqual(
            ['_id', 'name', 'email', 'subject', 'message', '__v', 'createdAt', 'updatedAt'].sort(),
        );
    });

    test(`creates email with all parameters`, async () => {
        expect.assertions(10);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Jane';
        const email = 'jane@gmail.com';
        const subject = 'subject';
        const message = 'I need help';

        const emailDocument = await SDK.emails.create({
            name,
            email,
            subject,
            message,
            userId,
            username,
        });

        expect(emailDocument._id).toEqual(expect.any(String));
        expect(emailDocument.name).toEqual(name);
        expect(emailDocument.email).toEqual(email);
        expect(emailDocument.subject).toEqual(subject);
        expect(emailDocument.message).toEqual(message);
        expect(emailDocument.userId).toBeDefined();
        expect(emailDocument.username).toEqual(username);
        expect(emailDocument.createdAt).toEqual(expect.any(String));
        expect(emailDocument.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(emailDocument).sort()).toEqual(
            [
                '_id',
                'name',
                'email',
                'subject',
                'message',
                'username',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );
    });
});
