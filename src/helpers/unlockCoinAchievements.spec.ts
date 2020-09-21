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
});
