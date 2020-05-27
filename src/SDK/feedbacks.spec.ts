import { feedbacks as feedbacksImport } from './feedbacks';
describe('SDK feedback', () => {
    describe('create', () => {
        const postRequest = jest.fn().mockResolvedValue(true);
        const feedbacks = feedbacksImport({
            postRequest,
        });
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const userId = '12345678';
            const pageUrl = '/solo-streaks';
            const userEmail = 'userEmail';
            const username = 'username';
            const feedbackText = 'feedback';

            await feedbacks.create({
                userId,
                pageUrl,
                username,
                userEmail,
                feedbackText,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/feedbacks`,
                params: {
                    userId,
                    pageUrl,
                    username,
                    userEmail,
                    feedbackText,
                },
            });
        });
    });
});
