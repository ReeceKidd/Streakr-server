import { emails as emailsImport } from './emails';

describe('SDK emails', () => {
    const postRequest = jest.fn().mockResolvedValue(true);
    const emails = emailsImport({
        postRequest,
    });

    describe('create', () => {
        test('calls POST with correct URL and required parameters', async () => {
            expect.assertions(1);

            const name = 'John Doe';
            const email = 'john@test.com';
            const subject = 'subject';
            const message = 'Support request';

            await emails.create({
                name,
                email,
                subject,
                message,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/emails`,
                params: {
                    name,
                    email,
                    subject,
                    message,
                },
            });
        });

        test('calls POST with correct URL and all available parameters', async () => {
            expect.assertions(1);

            const name = 'John Doe';
            const email = 'john@test.com';
            const subject = 'subject';
            const message = 'Support request';
            const userId = 'userId';
            const username = 'username';

            await emails.create({
                name,
                email,
                subject,
                message,
                userId,
                username,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/emails`,
                params: {
                    name,
                    email,
                    subject,
                    message,
                    userId,
                    username,
                },
            });
        });
    });
});
