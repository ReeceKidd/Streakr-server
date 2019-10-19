import nodemailer from 'nodemailer';
import { getServiceConfig } from './getServiceConfig';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'reecekidd95@gmail.com',
        pass: 'Milkshake123@',
    },
});

const { NODE_ENV } = getServiceConfig();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (subject: string, text: string): Promise<any> => {
    if (NODE_ENV !== 'test') {
        const mailOptions = {
            from: 'reecekidd95@gmail.com',
            to: 'reecekidd95@gmail.com',
            subject,
            text,
        };
        return transporter.sendMail(mailOptions);
    }
};
