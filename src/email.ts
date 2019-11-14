import nodemailer from 'nodemailer';
import { getServiceConfig } from './getServiceConfig';

const { EMAIL_FROM, EMAIL_PASSWORD } = getServiceConfig();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
    },
});

const { NODE_ENV } = getServiceConfig();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (subject: string, text: string): Promise<any> => {
    if (NODE_ENV !== 'test') {
        const mailOptions = {
            from: EMAIL_FROM,
            to: EMAIL_FROM,
            subject,
            text,
        };
        return transporter.sendMail(mailOptions);
    }
};
