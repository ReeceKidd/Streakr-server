import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';

jest.setTimeout(120000);

describe('GET /streak-recommendations', () => {
    let streakoid: StreakoidFactory;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            streakoid = await streakoidTest();
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`random streak recommendations can be retrieved`, async () => {
        expect.assertions(10);

        await getPayingUser();
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        await streakoid.challenges.create({
            name,
            description,
            icon,
        });

        const streakRecommendations = await streakoid.streakRecommendations.getAll({
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

        await getPayingUser();
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        await streakoid.challenges.create({
            name,
            description,
            icon,
        });

        const streakRecommendations = await streakoid.streakRecommendations.getAll({
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

        await getPayingUser();
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        await streakoid.challenges.create({
            name,
            description,
            icon,
        });

        const streakRecommendations = await streakoid.streakRecommendations.getAll({
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
