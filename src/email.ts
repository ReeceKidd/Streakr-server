import nodemailer from 'nodemailer';
import { getServiceConfig } from './getServiceConfig';

const { EMAIL_FROM, EMAIL_PASSWORD, EMAIL_TO } = getServiceConfig();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
    },
});

const { NODE_ENV } = getServiceConfig();

export const sendEmail = async ({
    subject,
    text,
    emailFrom,
}: {
    subject: string;
    text: string;
    emailFrom?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> => {
    if (NODE_ENV && NODE_ENV.toLowerCase() !== 'test') {
        const mailOptions = {
            from: emailFrom,
            to: EMAIL_TO,
            subject,
            text,
        };
        return transporter.sendMail(mailOptions);
    }
};
