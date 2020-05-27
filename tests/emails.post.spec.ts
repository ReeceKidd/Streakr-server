// import { StreakoidFactory } from '../src/streakoid';
// import { streakoidTest } from './setup/streakoidTest';
// import { getPayingUser } from './setup/getPayingUser';
// import { isTestEnvironment } from './setup/isTestEnvironment';
// import { setUpDatabase } from './setup/setUpDatabase';
// import { tearDownDatabase } from './setup/tearDownDatabase';
// import { getServiceConfig } from '../getServiceConfig';
// const username = getServiceConfig().USER;

// jest.setTimeout(120000);

// describe('POST /emails', () => {
//     let streakoid: StreakoidFactory;
//     let userId: string;

//     beforeAll(async () => {
//         if (isTestEnvironment()) {
//             await setUpDatabase();
//             const user = await getPayingUser();
//             userId = user._id;
//             streakoid = await streakoidTest();
//         }
//     });

//     afterAll(async () => {
//         if (isTestEnvironment()) {
//             await tearDownDatabase();
//         }
//     });

//     test(`creates email with minimum parameters`, async () => {
//         expect.assertions(8);

//         const name = 'Jane';
//         const email = 'jane@gmail.com';
//         const subject = 'Cancel memership';
//         const message = 'I need help';

//         const emailDocument = await streakoid.emails.create({
//             name,
//             email,
//             subject,
//             message,
//         });

//         expect(emailDocument._id).toEqual(expect.any(String));
//         expect(emailDocument.name).toEqual(name);
//         expect(emailDocument.email).toEqual(email);
//         expect(emailDocument.subject).toEqual(subject);
//         expect(emailDocument.message).toEqual(message);
//         expect(emailDocument.createdAt).toEqual(expect.any(String));
//         expect(emailDocument.updatedAt).toEqual(expect.any(String));
//         expect(Object.keys(emailDocument).sort()).toEqual(
//             ['_id', 'name', 'email', 'subject', 'message', '__v', 'createdAt', 'updatedAt'].sort(),
//         );
//     });

//     test(`creates email with all parameters`, async () => {
//         expect.assertions(10);

//         const name = 'Jane';
//         const email = 'jane@gmail.com';
//         const subject = 'subject';
//         const message = 'I need help';

//         const emailDocument = await streakoid.emails.create({
//             name,
//             email,
//             subject,
//             message,
//             userId,
//             username,
//         });

//         expect(emailDocument._id).toEqual(expect.any(String));
//         expect(emailDocument.name).toEqual(name);
//         expect(emailDocument.email).toEqual(email);
//         expect(emailDocument.subject).toEqual(subject);
//         expect(emailDocument.message).toEqual(message);
//         expect(emailDocument.userId).toBeDefined();
//         expect(emailDocument.username).toEqual(username);
//         expect(emailDocument.createdAt).toEqual(expect.any(String));
//         expect(emailDocument.updatedAt).toEqual(expect.any(String));
//         expect(Object.keys(emailDocument).sort()).toEqual(
//             [
//                 '_id',
//                 'name',
//                 'email',
//                 'subject',
//                 'message',
//                 'username',
//                 'createdAt',
//                 'updatedAt',
//                 'userId',
//                 '__v',
//             ].sort(),
//         );
//     });
// });
