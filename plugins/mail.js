const { Resend } = require('resend');
const fsPromises = require('fs/promises');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = {
    async sendVerificationEmail(email, link) {
        let html = await fsPromises.readFile('templates/emailVerify.html', 'utf8');
        html = html.replace(/CONFIRMATION_LINK/g, link);
        html = html.replace(/FRONTEND_URL/g, process.env.FRONTEND_URL);
        return resend.emails.send({
            from: 'FitnessPlus <send@fitnessplus.sded.cc>',
            to: email,
            subject: 'FitnessPlus - Email Verification',
            html: html,
        });
    },
    async sendResetPasswordEmail(email, link) {
        let html = await fsPromises.readFile('templates/resetPassword.html', 'utf8');
        html = html.replace(/RESET_LINK/g, link);
        html = html.replace(/FRONTEND_URL/g, process.env.FRONTEND_URL);
        return resend.emails.send({
            from: 'FitnessPlus <send@fitnessplus.sded.cc>',
            to: email,
            subject: 'FitnessPlus - Reset Password',
            html: html,
        });
    }
}