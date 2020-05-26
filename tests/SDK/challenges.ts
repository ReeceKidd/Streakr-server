/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { PopulatedChallenge } from '@streakoid/streakoid-models/lib/Models/PopulatedChallenge';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest } from './request';

const challenges = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const getAll = async ({ searchQuery, limit }: { searchQuery?: string; limit?: number }): Promise<Challenge[]> => {
        try {
            let getAllChallengesURL = `/${ApiVersions.v1}/${RouterCategories.challenges}?`;

            if (searchQuery) {
                getAllChallengesURL = `${getAllChallengesURL}searchQuery=${searchQuery}&`;
            }

            if (limit) {
                getAllChallengesURL = `${getAllChallengesURL}limit=${limit}&`;
            }

            return getRequest({ route: getAllChallengesURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getOne = async ({ challengeId }: { challengeId: string }): Promise<PopulatedChallenge> => {
        try {
            return getRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.challenges}/${ApiVersions.v1}/${challengeId}`,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        name,
        description,
        icon,
        color,
        numberOfMinutes,
        whatsappGroupLink,
        discordGroupLink,
    }: {
        name: string;
        description: string;
        icon?: string;
        color?: string;
        numberOfMinutes?: number;
        whatsappGroupLink?: string;
        discordGroupLink?: string;
    }): Promise<{ challenge: Challenge }> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.challenges}`,
                params: {
                    name,
                    description,
                    icon,
                    color,
                    numberOfMinutes,
                    whatsappGroupLink,
                    discordGroupLink,
                },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
        getOne,
        create,
    };
};

export { challenges };
