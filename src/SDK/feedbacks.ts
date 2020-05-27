import ApiVersions from './ApiVersions';
import { Feedback } from '@streakoid/streakoid-models/lib/Models/Feedback';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { PostRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const feedbacks = ({ postRequest }: { postRequest: PostRequest }) => {
    const create = async ({
        userId,
        pageUrl,
        username,
        userEmail,
        feedbackText,
    }: {
        userId: string;
        pageUrl: string;
        username: string;
        userEmail: string;
        feedbackText: string;
    }): Promise<Feedback> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.feedbacks}`,
                params: {
                    userId,
                    pageUrl,
                    username,
                    userEmail,
                    feedbackText,
                },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        create,
    };
};

export { feedbacks };
