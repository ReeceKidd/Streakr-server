import ApiVersions from './ApiVersions';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { IncompleteChallengeStreakTask } from '@streakoid/streakoid-models/lib/Models/IncompleteChallengeStreakTask';
import { PostRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const incompleteChalllengeStreakTasks = ({ postRequest }: { postRequest: PostRequest }) => {
    const create = async ({
        userId,
        challengeStreakId,
    }: {
        userId: string;
        challengeStreakId: string;
    }): Promise<IncompleteChallengeStreakTask> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.incompleteChallengeStreakTasks}`,
                params: { userId, challengeStreakId },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        create,
    };
};

export { incompleteChalllengeStreakTasks };
