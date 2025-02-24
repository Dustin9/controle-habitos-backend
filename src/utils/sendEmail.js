const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: process.env.SMTP_PORT,
secure: false,
auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
},
});

const sendEmail = async (options) => {
await transporter.sendMail({
    from: `Habito <${process.env.SMTP_USER}>`,
    ...options,
});
};

module.exports = sendEmail;