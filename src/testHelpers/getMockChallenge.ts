import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';

export const getMockChallenge = (): Challenge => ({
    _id: 'challengeId',
    name: 'Reading',
    description: 'Must read a non fiction book each day',
    databaseName: 'reading',
    members: [],
    numberOfMembers: 0,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
