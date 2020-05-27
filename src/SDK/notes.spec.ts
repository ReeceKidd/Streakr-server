import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { notes as notesImport } from './notes';

describe('SDK notes', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const deleteRequest = jest.fn().mockResolvedValue(true);
    const notes = notesImport({
        getRequest,
        postRequest,
        deleteRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await notes.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/notes?` });
        });

        test('calls GET with correct URL when userId query paramter is passed', async () => {
            expect.assertions(1);

            const userId = 'userId';

            await notes.getAll({ userId });

            expect(getRequest).toBeCalledWith({ route: `/v1/notes?userId=${userId}&` });
        });

        test('calls GET with correct URL when subjectId query paramter is passed', async () => {
            expect.assertions(1);

            const subjectId = 'subjectId';

            await notes.getAll({ subjectId });

            expect(getRequest).toBeCalledWith({ route: `/v1/notes?subjectId=subjectId&` });
        });

        test('calls GET with correct URL when all available parameters are passed', async () => {
            expect.assertions(1);

            const userId = 'userId';
            const subjectId = 'subjectId';

            await notes.getAll({ userId, subjectId });

            expect(getRequest).toBeCalledWith({ route: `/v1/notes?userId=${userId}&subjectId=${subjectId}&` });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await notes.getOne('id');

            expect(getRequest).toBeCalledWith({ route: `/v1/notes/id` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const userId = 'userId';
            const subjectId = 'subjectId';
            const text = 'Finished reading 4 hour work week';
            const streakType = StreakTypes.solo;

            await notes.create({
                userId,
                subjectId,
                text,
                streakType,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/notes`,
                params: {
                    userId,
                    subjectId,
                    text,
                    streakType,
                },
            });
        });
    });

    describe('deleteOne', () => {
        test('calls DELETE correct URL ', async () => {
            expect.assertions(1);

            await notes.deleteOne({
                noteId: 'noteId',
            });

            expect(deleteRequest).toBeCalledWith({ route: `/v1/notes/noteId` });
        });
    });
});
