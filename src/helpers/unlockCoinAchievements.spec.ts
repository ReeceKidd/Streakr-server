/* eslint-disable @typescript-eslint/no-explicit-any */
import { userModel } from '../Models/User';
import { achievementModel } from '../Models/Achievement';
import { unlockCoinsAchievements } from './unlockCoinsAchievements';
import { getMockUser } from '../testHelpers/getMockUser';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

describe('unlockCoinsAchievements', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('when user.coins is less than 1000 and coins to credit + user.coins is greater than 1000 it creates a one thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 999 };

        const achievement = {
            type: AchievementTypes.oneThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.oneThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 10000 and coins to credit + user.coins is greater than 10000 it creates a ten thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 9999 };

        const achievement = {
            type: AchievementTypes.tenThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.tenThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 25000 and coins to credit + user.coins is greater than 25000 it creates a twenty five thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 24999 };

        const achievement = {
            type: AchievementTypes.twentyFiveThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.twentyFiveThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 50000 and coins to credit + user.coins is greater than 50000 it creates a fifty thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 49999 };

        const achievement = {
            type: AchievementTypes.fiftyThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.fiftyThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 100,000 and coins to credit + user.coins is greater than 100,000 it creates a one hundred thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 99999 };

        const achievement = {
            type: AchievementTypes.oneHundredThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.oneHundredThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 250,000 and coins to credit + user.coins is greater than 250,000 it creates a two hundred and fifty thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 249999 };

        const achievement = {
            type: AchievementTypes.twoHundredAndFiftyThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.twoHundredAndFiftyThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 500,000 and coins to credit + user.coins is greater than 500,000 it creates a five hundred thousand coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 499999 };

        const achievement = {
            type: AchievementTypes.fiveHundredThousandCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.fiveHundredThousandCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });

    test('when user.coins is less than 1,000,000 and coins to credit + user.coins is greater than 1,000,000 it creates a one million coins achievement.', async () => {
        expect.assertions(2);

        const user = { ...getMockUser({ _id: 'userId' }), coins: 999999 };

        const achievement = {
            type: AchievementTypes.oneMillionCoins,
        };

        achievementModel.findOne = jest.fn().mockResolvedValue(achievement) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        await unlockCoinsAchievements({ user, coinsToCredit: 10 });

        expect(achievementModel.findOne).toBeCalledWith({
            achievementType: AchievementTypes.oneMillionCoins,
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: achievement },
        });
    });
});
