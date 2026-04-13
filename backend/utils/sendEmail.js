const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // If you haven't set EMAIL_USER and EMAIL_PASS in your .env,
    // this will fall back to just logging the email in development.
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // You can use other services here
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    const mailOptions = {
        from: `CampusConnect <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        text: options.message
    };

    if (isEmailConfigured) {
        // 3) Actually send the email
        await transporter.sendMail(mailOptions);
    } else {
        console.log('\n=============================================');
        console.log('WARNING: Email Credentials Not Set in .env');
        console.log('=============================================');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message:\n${options.html || options.message}`);
        console.log('=============================================\n');
    }
};

module.exports = sendEmail;
