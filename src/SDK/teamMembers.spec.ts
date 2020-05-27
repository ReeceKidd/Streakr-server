import { teamMembers as teamMembersImport } from './teamMembers';

describe('SDK teamMembers', () => {
    const postRequest = jest.fn().mockResolvedValue(true);
    const deleteRequest = jest.fn().mockResolvedValue(true);
    const teamMembers = teamMembersImport({
        postRequest,
        deleteRequest,
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const followerId = 'followerId';
            const teamStreakId = 'teamStreakId';

            await teamMembers.create({
                followerId,
                teamStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/team-streaks/teamStreakId/members`,
                params: {
                    followerId,
                },
            });
        });
    });

    describe('deleteOne', () => {
        test('calls DELETE correct URL ', async () => {
            expect.assertions(1);

            await teamMembers.deleteOne({
                teamStreakId: 'teamStreakId',
                memberId: 'memberId',
            });

            expect(deleteRequest).toBeCalledWith({ route: `/v1/team-streaks/teamStreakId/members/memberId` });
        });
    });
});
