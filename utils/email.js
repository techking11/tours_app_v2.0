const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Nay Myo Aung<${process.env.USER_EMAIL}>`;
  }

  async newTransport() {
    // A) Send real email with

    if (process.env.NODE_ENV === 'production') {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL,
      );

      oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
      const ACCESS_TOKEN = await oAuth2Client.getAccessToken();

      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAUTH2',
          user: process.env.USER_EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN.token,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });
    }

    // B) create mail transport
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // render the base email
    const html = await pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        subject,
        url: this.url,
        firstName: this.firstName,
      },
    );

    // 2) define mail options
    const mailOptions = {
      from: this.from,
      subject,
      to: this.to,
      html,
      text: htmlToText.convert(html),
    };

    // 3) Actually send the mail
    const transporter = await this.newTransport();
    await transporter.sendMail(mailOptions);
  }

  sendWelcome() {
    this.send('welcome', 'Welcome to Natours !');
  }

  sendPasswordReset() {
    this.send('passwordReset', 'Forgot  your password ?');
  }
};
