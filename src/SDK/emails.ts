import ApiVersions from './ApiVersions';
import { Email } from '@streakoid/streakoid-models/lib/Models/Email';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { PostRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const emails = ({ postRequest }: { postRequest: PostRequest }) => {
    const create = async ({
        name,
        email,
        subject,
        message,
        userId,
        username,
    }: {
        name: string;
        email: string;
        subject: string;
        message: string;
        userId?: string;
        username?: string;
    }): Promise<Email> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.emails}`,
                params: {
                    name,
                    email,
                    subject,
                    message,
                    userId,
                    username,
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

export { emails };
