import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { patchRequest, postRequest, getRequest } from './request';
import ApiVersions from '../../src/Server/versions';

const getAll = async ({
    userId,
    teamStreakId,
    completedToday,
    timezone,
    active,
}: {
    userId?: string;
    teamStreakId?: string;
    completedToday?: boolean;
    timezone?: string;
    active?: boolean;
}): Promise<TeamMemberStreak[]> => {
    try {
        let getAllTeamMemberStreaksURL = `/${ApiVersions.v1}/${RouterCategories.teamMemberStreaks}?`;

        if (userId) {
            getAllTeamMemberStreaksURL = `${getAllTeamMemberStreaksURL}userId=${userId}&`;
        }

        if (teamStreakId) {
            getAllTeamMemberStreaksURL = `${getAllTeamMemberStreaksURL}teamStreakId=${teamStreakId}&`;
        }

        if (completedToday !== undefined) {
            getAllTeamMemberStreaksURL = `${getAllTeamMemberStreaksURL}completedToday=${Boolean(completedToday)}&`;
        }

        if (timezone) {
            getAllTeamMemberStreaksURL = `${getAllTeamMemberStreaksURL}timezone=${timezone}&`;
        }

        if (active !== undefined) {
            getAllTeamMemberStreaksURL = `${getAllTeamMemberStreaksURL}active=${Boolean(active)}`;
        }

        return getRequest({ route: getAllTeamMemberStreaksURL });
    } catch (err) {
        return Promise.reject(err);
    }
};

const getOne = async (teamMemberStreakId: string): Promise<TeamMemberStreak> => {
    try {
        return getRequest({ route: `/${ApiVersions.v1}/${RouterCategories.teamMemberStreaks}/${teamMemberStreakId}` });
    } catch (err) {
        return Promise.reject(err);
    }
};

const create = async ({
    userId,
    teamStreakId,
}: {
    userId: string;
    teamStreakId: string;
}): Promise<TeamMemberStreak> => {
    try {
        return postRequest({
            route: `/${ApiVersions.v1}/${RouterCategories.teamMemberStreaks}`,
            params: { userId, teamStreakId },
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

const update = async ({
    teamMemberStreakId,
    updateData,
}: {
    teamMemberStreakId: string;
    updateData?: {
        timezone?: string;
        completedToday?: boolean;
        active?: boolean;
        currentStreak?: CurrentStreak;
        pastStreaks?: PastStreak[];
    };
}): Promise<TeamMemberStreak> => {
    try {
        return patchRequest({
            route: `/${ApiVersions.v1}/${RouterCategories.teamMemberStreaks}/${teamMemberStreakId}`,
            params: updateData,
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const teamMemberStreaks = {
    getAll,
    getOne,
    create,
    update,
};

export { teamMemberStreaks };
