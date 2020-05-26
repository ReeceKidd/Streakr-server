import { TeamMember } from '@streakoid/streakoid-models/lib/Models/TeamMember';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import TeamStreakRouterCategories from '@streakoid/streakoid-models/lib/Types/TeamStreakRouterCategories';
import { deleteRequest, postRequest } from './request';
import ApiVersions from '../../src/Server/versions';

const create = async ({
    followerId,
    teamStreakId,
}: {
    followerId: string;
    teamStreakId: string;
}): Promise<TeamMember> => {
    try {
        return postRequest({
            route: `/${ApiVersions.v1}/${RouterCategories.teamStreaks}/${teamStreakId}/${TeamStreakRouterCategories.members}`,
            params: { followerId },
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteOne = ({ teamStreakId, memberId }: { teamStreakId: string; memberId: string }): Promise<any> => {
    try {
        return deleteRequest({
            route: `/${ApiVersions.v1}/${RouterCategories.teamStreaks}/${teamStreakId}/${TeamStreakRouterCategories.members}/${memberId}`,
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

const teamMembers = {
    create,
    deleteOne,
};

export { teamMembers };
