import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'reecekidd95@gmail.com',
        pass: 'Milkshake123@',
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (subject: string, text: string): Promise<any> => {
    const mailOptions = {
        from: 'reecekidd95@gmail.com',
        to: 'reecekidd95@gmail.com',
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
};
