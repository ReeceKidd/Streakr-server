import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-streak-recommendations';

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

    test(`random streak recommendations can be retrieved`, async () => {
        expect.assertions(10);

        await getPayingUser({ testName });
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const streakRecommendations = await SDK.streakRecommendations.getAll({
            random: true,
            limit: 5,
            sortedByNumberOfMembers: false,
        });

        const streakRecommendation = streakRecommendations[0];

        expect(streakRecommendation._id).toEqual(expect.any(String));
        expect(streakRecommendation.name).toEqual(name);
        expect(streakRecommendation.databaseName).toEqual(name.toLowerCase());
        expect(streakRecommendation.description).toEqual(description);
        expect(streakRecommendation.icon).toEqual(icon);
        expect(streakRecommendation.members).toEqual([]);
        expect(streakRecommendation.numberOfMembers).toEqual(0);
        expect(streakRecommendation.createdAt).toEqual(expect.any(String));
        expect(streakRecommendation.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakRecommendation).sort()).toEqual(
            [
                '_id',
                'name',
                'databaseName',
                'description',
                'icon',
                'members',
                'numberOfMembers',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`non random streak recommendations can be retrieved`, async () => {
        expect.assertions(10);

        await getPayingUser({ testName });
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const streakRecommendations = await SDK.streakRecommendations.getAll({
            random: false,
            limit: 5,
            sortedByNumberOfMembers: false,
        });

        const streakRecommendation = streakRecommendations[0];

        expect(streakRecommendation._id).toEqual(expect.any(String));
        expect(streakRecommendation.name).toEqual(name);
        expect(streakRecommendation.databaseName).toEqual(name.toLowerCase());
        expect(streakRecommendation.description).toEqual(description);
        expect(streakRecommendation.icon).toEqual(icon);
        expect(streakRecommendation.members).toEqual([]);
        expect(streakRecommendation.numberOfMembers).toEqual(0);
        expect(streakRecommendation.createdAt).toEqual(expect.any(String));
        expect(streakRecommendation.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakRecommendation).sort()).toEqual(
            [
                '_id',
                'name',
                'databaseName',
                'description',
                'icon',
                'members',
                'numberOfMembers',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`streak recommendations sorted by numberOfMembers can be retrieved`, async () => {
        expect.assertions(10);

        await getPayingUser({ testName });
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const streakRecommendations = await SDK.streakRecommendations.getAll({
            random: false,
            limit: 5,
            sortedByNumberOfMembers: true,
        });

        const streakRecommendation = streakRecommendations[0];

        expect(streakRecommendation._id).toEqual(expect.any(String));
        expect(streakRecommendation.name).toEqual(name);
        expect(streakRecommendation.databaseName).toEqual(name.toLowerCase());
        expect(streakRecommendation.description).toEqual(description);
        expect(streakRecommendation.icon).toEqual(icon);
        expect(streakRecommendation.members).toEqual([]);
        expect(streakRecommendation.numberOfMembers).toEqual(0);
        expect(streakRecommendation.createdAt).toEqual(expect.any(String));
        expect(streakRecommendation.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakRecommendation).sort()).toEqual(
            [
                '_id',
                'name',
                'databaseName',
                'description',
                'icon',
                'members',
                'numberOfMembers',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
