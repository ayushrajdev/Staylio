import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    //   port: 465,
    auth: {
        user: 'ayushraj2482@gmail.com',
        pass: 'yftf acgb alpy ipge',
    },
});

export default transporter;

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        const info = await transporter.sendMail({
            from: 'Staylio',
            to,
            subject,
            html,
        });
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}
