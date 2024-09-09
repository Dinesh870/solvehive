import nodemailer from 'nodemailer';

export const sendEmail = async (option) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.outlook.com",
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const emailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    await transporter.sendMail(emailOptions);
}

export const sendFeedbackMail = async (option) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.outlook.com",
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const emailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME,
        subject: option.subject,
        text: option.message,
        replyTo: option.email
    }
    await transporter.sendMail(emailOptions);
}
